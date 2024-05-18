// import { DataSourceConnection } from "@/infra/DataSource";
// import { WebServer } from "@/infra/Server";
// import { createReadStream, readFile, readFileSync } from "fs";
// import request from "supertest";
// import { beforeAll, describe, expect, test } from "vitest";
// import { Express } from "express";
// import { config } from "dotenv";

// config();

// describe("[e2e] StockBook", async () => {
// 	let dataSourceConnection: DataSourceConnection;
// 	let webServer: WebServer;
// 	let app: Express;

// 	beforeAll(async () => {
// 		dataSourceConnection = new DataSourceConnection();
// 		webServer = new WebServer(dataSourceConnection);
// 		app = (await webServer.start(true)) as Express;
// 	});

// 	test("should return orderId", async () => {
// 		const fileStream = createReadStream(`${__dirname}/ddd-book.jpg`);
// 		const response = await request(app)
// 			.post("/stock_book")
// 			.attach("cover", fileStream)
// 			.field("title", "Domain-Driven Design")
// 			.field("edition", "18")
// 			.field("author", "Eric Evans")
// 			.field("release", "2003-08-22T03:00:00.000Z")
// 			.field("quantity", "15")
// 			.field("isVisible", "true")
// 			.field("unitPrice", "50");

// 		// console.log(response);
// 		// expect(response.body.bookId).toBeDefined();
// 	});
// });
