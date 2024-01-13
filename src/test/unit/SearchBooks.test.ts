import { SearchBooks } from "@/application/usecase/SearchBooks";
import { StockBook } from "@/application/usecase/StockBook";
import { INPUT_BOOK } from "../constants";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { BookNotFoundError } from "@/error/BookError";
import { BookLocalFileStorage } from "@/infra/repository/mock/BookLocalFileStorage";
import { BookMemoryRepository } from "@/infra/repository/mock/BookMemoryRepository";
import { BookRepository } from "@/application/repository/BookRepository";
import { MockQueue } from "@/infra/queue/mock/MockQueue";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

describe("SearchBooks", () => {
	let stockBook: StockBook;
	let searchBooks: SearchBooks;

	let bookRepository: BookRepository;

	let queue: MockQueue;
	const registry: DependencyRegistry = new DependencyRegistry();

	beforeAll(() => {
		queue = new MockQueue();
		bookRepository = new BookMemoryRepository();

		registry
			.push("queue", queue)
			.push("bookRepository", bookRepository)
			.push("bookFileStorage", new BookLocalFileStorage())
			.push("searchBooks", new SearchBooks(registry));
	});

	beforeEach(() => {
		stockBook = new StockBook(registry);
		searchBooks = new SearchBooks(registry);
	});

	test("should search stocked books by title", async () => {
		await stockBook.execute(INPUT_BOOK);
		const stockedBooks = await searchBooks.execute("Domain-Driven Design");

		expect(stockedBooks.length).toBe(1);
	});

	test("should return BookNotFoundError", async () => {
		const fn = () => searchBooks.execute("domain");

		expect(fn).rejects.toBeInstanceOf(BookNotFoundError);
	});
});
