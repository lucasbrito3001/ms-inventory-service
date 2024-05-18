import "reflect-metadata";
import "module-alias/register";

import { config } from "dotenv";
import { DataSourceConnection } from "./infra/DataSource";
import { WebServer } from "./infra/Server";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { GeneralLogger } from "./infra/log/GeneralLogger";
import { FileStorage } from "./infra/FileStorage";
import { BookCoverCloudFileStorage } from "./infra/repository/BookCloudFileStorage";

config();

const logger = new GeneralLogger();

const dataSourceConnection = new DataSourceConnection();
const queueAdapter = new RabbitMQAdapter(logger);
const bookCoverBucket = new FileStorage(
	JSON.parse(process.env.SVC_ACC_GCP_BUCKET as string)
).bucket("book-covers-stock");
const bookCoverFileStorage = new BookCoverCloudFileStorage(bookCoverBucket);
const webServer = new WebServer(
	dataSourceConnection,
	queueAdapter,
	logger,
	bookCoverFileStorage
);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		console.log(`[${signal.toUpperCase()}]: ${err}`);
		webServer.gracefulShutdown();
		process.exit(1);
	})
);

webServer.start(false);
