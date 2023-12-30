import "reflect-metadata";

import "module-alias/register";
import { config } from "dotenv";
import { DataSourceConnection } from "./infra/DataSource";
import { WebServer } from "./infra/Server";
import multer from "multer";
import { Book } from "./domain/entities/Book";

config();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "/tmp/uploads");
	},
	filename: function (req, file, cb) {
		const { title, edition } = req.body;
		const filename = Book.coverFilename(title, edition, "jpg");
		req.body.cover = filename;
		cb(null, filename);
	},
});
export const uploader = multer({ storage });

const dataSourceConnection = new DataSourceConnection();

const webServer = new WebServer(dataSourceConnection);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		console.log(err);
		webServer.gracefulShutdown();
		process.exit(1);
	})
);

webServer.start();
