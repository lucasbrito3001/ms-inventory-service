import express, { Express, NextFunction, Request, Response } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { CONFIG_ROUTERS } from "./router";
import { ErrorsData, ErrorBase } from "@/error/ErrorBase";
import { DependencyRegistry } from "./DependencyRegistry";
import { BookRepositoryDatabase } from "./repository/BookDatabaseRepository";
import { BookEntity } from "./repository/entity/Book.entity";
import { StockBook } from "@/application/usecase/StockBook";
import { QueueController } from "./queue/QueueController";
import cors from "cors";
import { CheckOrderItems } from "@/application/usecase/CheckOrderItems";
import { UncaughtExceptionHandler } from "@/error/UncaughtExceptionHandler";
import { SearchBooks } from "@/application/usecase/SearchBooks";
import { Logger } from "./log/Logger";
import { Queue } from "./queue/Queue";
import { OrderRegisteredSub } from "./queue/subscriber/OrderRegisteredSub";
import { UpdatePrice } from "@/application/usecase/UpdatePrice";
import {
	DatabaseConnectionError,
	QueueConnectionError,
} from "@/error/InfraError";
import { BookFileStoragePort } from "@/application/repository/BookFileStorage";
import { GetBookInformations } from "@/application/usecase/GetBookInformations";
import { OpenAIAdapter } from "./generativeai/OpenAIAdapter";

type WebServerErrorNames = "WEB_SERVER_CLOSED";

export const WEB_SERVER_ERRORS: ErrorsData<WebServerErrorNames> = {
	WEB_SERVER_CLOSED: {
		message: "Can't close the web server, it's already closed.",
		httpCode: 0,
	},
};

export class WebServerError extends ErrorBase {
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

	constructor(
		private dataSourceConnection: DataSourceConnection,
		private queue: Queue,
		private logger: Logger,
		private bookCoverFileStorage: BookFileStoragePort
	) {}

	start = async (isTest: boolean) => {
		this.app.use(express.json());
		this.app.use(cors());

		try {
			await this.dataSourceConnection.initialize();
		} catch (error) {
			console.log(error);
			throw new DatabaseConnectionError(error as any);
		}

		try {
			await this.queue.connect();
		} catch (error) {
			throw new QueueConnectionError(error as any);
		}

		const registry = await this.fillRegistry();

		this.setRoutes(registry);
		this.setQueueControllerSubscribers(registry);

		// Exception handler middleware
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction): void => {
				return new UncaughtExceptionHandler(res, this.logger).handle(err);
			}
		);

		if (isTest) return this.app;

		this.server = this.app.listen(process.env.PORT, () => {
			this.logger.log(
				`\n[SERVER] Server started, listening on port: ${process.env.PORT}\n`
			);
		});
	};

	private async fillRegistry() {
		const registry = new DependencyRegistry();

		const bookRepository = new BookRepositoryDatabase(
			this.dataSourceConnection.getRepository(BookEntity)
		);

		registry
			.push("queue", this.queue)
			.push("logger", this.logger)
			.push("bookRepository", bookRepository)
			.push("bookFileStorage", this.bookCoverFileStorage)
			.push("generativeAIService", new OpenAIAdapter(registry))
			.push("checkOrderItems", new CheckOrderItems(registry))
			.push("stockBook", new StockBook(registry))
			.push("updatePrice", new UpdatePrice(registry))
			.push("searchBooks", new SearchBooks(registry))
			.push("getBookInformations", new GetBookInformations(registry));

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
