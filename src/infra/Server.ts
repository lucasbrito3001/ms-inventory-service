import express, { Express } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import multer, { Multer } from "multer";
import { CONFIG_ROUTERS } from "./router";
import { Book } from "@/domain/entities/Book";
import { ErrorsData, ErrorBase } from "@/error/ErrorBase";
import { DependencyRegistry } from "./DependencyRegistry";
import { OrderRepositoryDatabase } from "./repository/OrderDatabaseRepository";
import { OrderEntity } from "./repository/entity/OrderEntity";
import { BookRepositoryDatabase } from "./repository/BookDatabaseRepository";
import { RegisterOrder } from "@/application/usecase/RegisterOrder";

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

		const registry = this.fillRegistry();
		this.setRoutes(app, registry);

		this.application = app.listen(process.env.PORT, () => {
			console.log("Server started, listening on port " + process.env.PORT);
		});
	};

	private fillRegistry() {
		const registry = new DependencyRegistry();

		const dependencies = [
			{
				name: "orderRepository",
				value: new OrderRepositoryDatabase(
					this.dataSourceConnection.getRepository(OrderEntity)
				),
			},
			{
				name: "bookRepository",
				value: new BookRepositoryDatabase(
					this.dataSourceConnection.getRepository(OrderEntity)
				),
			},
			{
				name: "registerOrder",
				value: new RegisterOrder(registry),
			},
		];

		dependencies.forEach((dependency) =>
			registry.push(dependency.name, dependency.value)
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
