import { beforeEach, describe, expect, test } from "vitest";
import { StockBook } from "../../application/usecase/StockBook";
import { GetStockedBooks } from "../../application/usecase/GetStockedBooks";
import { BookMemoryRepository } from "../../infra/repository/mock/BookMemoryRepository";
import { Book } from "../../domain/entities/Book";
import { INPUT_BOOK } from "../constants";
import { StockBookDTO } from "../../application/controller/dto/StockBookDto";
import { BookError } from "../../error/BookError";
import { BookLocalFileStorage } from "../../infra/repository/mock/BookLocalFileStorage";

describe("StockBook", () => {
	let stockBookUseCase: StockBook;
	let getStockBook: GetStockedBooks;
	let bookMemoryRepository: BookMemoryRepository;

	beforeEach(() => {
		bookMemoryRepository = new BookMemoryRepository();
		const bookLocalFileStorage = new BookLocalFileStorage();

		stockBookUseCase = new StockBook(
			bookMemoryRepository,
			bookLocalFileStorage,
			() => `0-0-0-0-0`
		);

		getStockBook = new GetStockedBooks(bookMemoryRepository);
	});

	test("should stock a new book successfully", async () => {
		const book = await stockBookUseCase.execute(INPUT_BOOK);
		const stockedBooks = await getStockBook.execute("Domain-Driven Design");

		expect(book instanceof Book).toBeTruthy();
	});

	test("should return INVALID_DTO error", async () => {
		const { title, ...INVALID_BOOK_DTO } = INPUT_BOOK;

		const bookOrError = await stockBookUseCase.execute(
			INVALID_BOOK_DTO as StockBookDTO
		);

		expect(bookOrError).toStrictEqual(
			new BookError("INVALID_DTO", [
				{
					code: "invalid_type",
					expected: "string",
					message: "Required",
					path: ["title"],
					received: "undefined",
				},
			])
		);
	});

	test("should return DUPLICATED_BOOK error", async () => {
		await bookMemoryRepository.save(INPUT_BOOK);

		const bookOrError = await stockBookUseCase.execute(INPUT_BOOK);

		expect(bookOrError).toStrictEqual(new BookError("DUPLICATED_BOOK"));
	});
});
