import express, { Express } from "express";
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
import { CheckOrderItems } from "@/application/usecase/CheckOrderItems";
import { BookCoverCloudFileStorage } from "./repository/BookCloudFileStorage";
import { FileStorage } from "./FileStorage";
import { GeneralLogger } from "./log/GeneralLogger";

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
	private application: Server | undefined;

	constructor(private dataSourceConnection: DataSourceConnection) {}

	start = async () => {
		await this.dataSourceConnection.initialize();

		const app = express();

		app.use(express.json());

		const registry = await this.fillRegistry();
		this.setRoutes(app, registry);
		new QueueController(registry);

		this.application = app.listen(process.env.PORT, () => {
			console.log("Server started, listening on port " + process.env.PORT);
		});
	};

	private async fillRegistry() {
		const queue = new RabbitMQAdapter();
		await queue.connect();
		const registry = new DependencyRegistry();

		const dependencies = [
			() => ({
				name: "queue",
				value: queue,
			}),
			() => ({
				name: "logger",
				value: new GeneralLogger(),
			}),
			() => ({
				name: "bookRepository",
				value: new BookRepositoryDatabase(
					this.dataSourceConnection.getRepository(BookEntity)
				),
			}),
			() => ({
				name: "bookCoverBucket",
				value: new FileStorage(
					JSON.parse(process.env.SVC_ACC_GCP_BUCKET as string)
				).bucket("book-covers-stock"),
			}),
			() => ({
				name: "bookCloudFileStorage",
				value: new BookCoverCloudFileStorage(registry),
			}),
			() => ({
				name: "checkOrderItems",
				value: new CheckOrderItems(registry),
			}),
			() => ({
				name: "stockBook",
				value: new StockBook(registry),
			}),
		];

		dependencies.forEach((dependency) =>
			registry.push(dependency().name, dependency().value)
		);

		return registry;
	}

	private setRoutes = (app: Express, registry: DependencyRegistry) => {
		CONFIG_ROUTERS.forEach((config_router) => {
			const router = express.Router();

			new config_router.router(router, registry).expose();

			app.use("/", router);
		});

		app.get("/healthy", (req, res) => {
			res.send("Hello world!");
		});
	};

	gracefulShutdown = () => {
		if (!this.application) throw new WebServerError("WEB_SERVER_CLOSED");

		this.application.close();
	};
}
