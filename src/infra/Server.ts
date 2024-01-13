import express, { Express, NextFunction, Request, Response } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { CONFIG_ROUTERS } from "./router";
import { ErrorsData, ErrorBase } from "@/error/ErrorBase";
import { DependencyRegistry } from "./DependencyRegistry";
import { BookRepositoryDatabase } from "./repository/BookDatabaseRepository";
import { BookEntity } from "./repository/entity/BookEntity";
import { StockBook } from "@/application/usecase/StockBook";
import { RabbitMQAdapter } from "./queue/RabbitMQAdapter";
import { QueueController } from "./queue/QueueController";
import cors from "cors";
import { CheckOrderItems } from "@/application/usecase/CheckOrderItems";
import { BookCoverCloudFileStorage } from "./repository/BookCloudFileStorage";
import { FileStorage } from "./FileStorage";
import { GeneralLogger } from "./log/GeneralLogger";
import { UncaughtExceptionHandler } from "@/error/UncaughtExceptionHandler";
import { SearchBooks } from "@/application/usecase/SearchBooks";
import { Logger } from "./log/Logger";
import { Queue } from "./queue/Queue";
import { OrderRegisteredSub } from "./queue/subscribers/OrderRegisteredSub";
import { UpdatePrice } from "@/application/usecase/UpdatePrice";

type WebServerErrorNames = "WEB_SERVER_CLOSED";

export const WEB_SERVER_ERRORS: ErrorsData<WebServerErrorNames> = {
	WEB_SERVER_CLOSED: {
		message: "Can't close the web server, it's already closed.",
		httpCode: 0,
	},
};

export class WebServerError extends ErrorBase<WebServerErrorNames> {
	constructor(errorName: WebServerErrorNames) {
		super(
			errorName,
			WEB_SERVER_ERRORS[errorName].message,
			WEB_SERVER_ERRORS[errorName].httpCode
		);
	}
}

export class WebServer {
	private server: Server | undefined;
	private app: Express = express();

	constructor(private dataSourceConnection: DataSourceConnection) {}

	start = async (isTest: boolean) => {
		this.app.use(express.json());
		this.app.use(cors());

		await this.dataSourceConnection.initialize();

		const logger = new GeneralLogger();
		const queue = await this.connectToQueue(logger);

		const registry = await this.fillRegistry(logger, queue);

		this.setRoutes(registry);
		this.setQueueControllerSubscribers(registry);

		// Exception handler middleware
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction): void => {
				return new UncaughtExceptionHandler(res, logger).handle(err);
			}
		);

		if (isTest) return this.app;

		this.server = this.app.listen(process.env.PORT, () => {
			logger.log(
				"\n[SERVER] Server started, listening on port: " + process.env.PORT
			);
		});
	};

	private async connectToQueue(logger: Logger): Promise<Queue> {
		const queue = new RabbitMQAdapter(logger);
		await queue.connect();
		return queue;
	}

	private async fillRegistry(logger: Logger, queue: Queue) {
		const registry = new DependencyRegistry();

		const bookRepository = new BookRepositoryDatabase(
			this.dataSourceConnection.getRepository(BookEntity)
		);
		const bookCoverBucket = new FileStorage(
			JSON.parse(process.env.SVC_ACC_GCP_BUCKET as string)
		).bucket("book-covers-stock");

		registry
			.push("queue", queue)
			.push("logger", logger)
			.push("bookRepository", bookRepository)
			.push("bookCoverBucket", bookCoverBucket)
			.push("bookFileStorage", new BookCoverCloudFileStorage(registry))
			.push("checkOrderItems", new CheckOrderItems(registry))
			.push("stockBook", new StockBook(registry))
			.push("updatePrice", new UpdatePrice(registry))
			.push("searchBooks", new SearchBooks(registry));

		return registry;
	}

	private setQueueControllerSubscribers = (registry: DependencyRegistry) => {
		const subs = [new OrderRegisteredSub(registry)];

		new QueueController(registry).appendSubscribers(subs);
	};

	private setRoutes = (registry: DependencyRegistry) => {
		CONFIG_ROUTERS.forEach((config_router) => {
			const router = express.Router();
			new config_router(router, registry).expose();
			this.app.use("/", router);
		});

		this.app.get("/healthy", (req, res) => {
			res.send("Hello world!");
		});
	};

	gracefulShutdown = () => {
		if (!this.server) return;
		this.server.close();
	};
}
