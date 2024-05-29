import { DataSourceConnection } from "@/infra/DataSource";
import { WebServer } from "@/infra/Server";
import { beforeAll, describe, expect, test } from "vitest";
import { Express } from "express";
import request from "supertest";
import { BookRepository } from "@/application/repository/BookRepository";
import { Book } from "@/domain/entities/Book";
import { BookEntity } from "@/infra/repository/entity/Book.entity";
import { BookRepositoryDatabase } from "@/infra/repository/BookDatabaseRepository";
import { MockInputBook, mockBooks } from "../constants";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";
import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { BookLocalFileStorage } from "@/infra/repository/mock/BookLocalFileStorage";
import { BookFileStoragePort } from "@/application/repository/BookFileStorage";
import { config } from "dotenv";

config();

describe("[e2e] GetBookInformations", () => {
	const logger = new GeneralLogger();
	const queue = new RabbitMQAdapter(logger);

	let dataSourceConnection: DataSourceConnection;
	let bookCoverFileStorage: BookFileStoragePort;
	let bookRepository: BookRepository;
	let webServer: WebServer;
	let app: Express;

	let bookId: string = "";

	beforeAll(async () => {
		dataSourceConnection = new DataSourceConnection();
		bookCoverFileStorage = new BookLocalFileStorage();
		webServer = new WebServer(
			dataSourceConnection,
			queue,
			logger,
			bookCoverFileStorage
		);
		app = (await webServer.start(true)) as Express;

		bookRepository = new BookRepositoryDatabase(
			dataSourceConnection.getRepository(BookEntity)
		);

		for (let i = 0; i < mockBooks.length; i++) {
			const book = Book.create(mockBooks[i]);
			if (i == 0) bookId = book.id;
			await bookRepository.save(book);
		}
	});

	test("should throw InvalidUUIDError when pass invalid id to the endpoint", async () => {
		const response = await request(app).get(`/get_book_informations/123`);

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("INVALID_UUID");
	});

	test("should throw BookNotFoundError when trying to get informations of a book that is not stocked", async () => {
		const fakeId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
		const response = await request(app).get(`/get_book_informations/${fakeId}`);

		expect(response.status).toBe(400);
		expect(response.body.name).toBe("BOOK_NOT_FOUND");
	});

	test("should return book informations", async () => {
		const response = await request(app).get(`/get_book_informations/${bookId}`);

		expect(response.status).toBe(200);
		expect(response.body.book).toBeDefined();
		expect(response.body.suggestions).toBeDefined();
	});
});
