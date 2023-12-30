import { GetStockedBooks } from "@/application/usecase/GetStockedBooks";
import { StockBook } from "@/application/usecase/StockBook";
import { INPUT_BOOK } from "../constants";
import { describe, expect, test } from "vitest";
import { BookError } from "@/error/BookError";
import { BookLocalFileStorage } from "@/infra/repository/mock/BookLocalFileStorage";
import { BookMemoryRepository } from "@/infra/repository/mock/BookMemoryRepository";

describe("GetStockedBooks", () => {
	test("should get stocked books", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const bookLocalFileStorage = new BookLocalFileStorage();
		const register = new StockBook(
			bookMemoryRepository,
			bookLocalFileStorage,
			() => `0-0-0-0-0`
		);
		const getStock = new GetStockedBooks(bookMemoryRepository);

		await register.execute(INPUT_BOOK);
		const stockedBooks = await getStock.execute("Domain-Driven Design");

		expect(
			Array.isArray(stockedBooks) && stockedBooks.length === 1
		).toBeTruthy();
	});

	test("should return INVALID_TITLE error", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const getStock = new GetStockedBooks(bookMemoryRepository);

		const booksOrError = await getStock.execute(undefined as unknown as string);

		expect(booksOrError).toStrictEqual(new BookError("INVALID_TITLE"));
	});

	test("should return BOOK_NOT_FOUND error", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const getStock = new GetStockedBooks(bookMemoryRepository);

		const booksOrError = await getStock.execute("Domain-Driven Design");

		expect(booksOrError).toStrictEqual(new BookError("BOOK_NOT_FOUND"));
	});
});
