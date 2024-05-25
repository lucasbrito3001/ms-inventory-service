import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { StockBook } from "../../application/usecase/StockBook";
import { SearchBooks } from "../../application/usecase/SearchBooks";
import { BookMemoryRepository } from "../../infra/data/repository/mock/BookMemoryRepository";
import { Book } from "../../domain/entities/Book";
import { INPUT_BOOK } from "../constants";
import { DuplicatedBookError } from "../../error/BookError";
import { BookLocalFileStorage } from "../../infra/data/repository/mock/BookLocalFileStorage";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { MockQueue } from "@/infra/queue/mock/MockQueue";
import { BookRepository } from "@/application/repository/BookRepository";

describe("[Use Case - StockBook]", () => {
	let stockBook: StockBook;

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
			.push("stockBook", new StockBook(registry));
	});

	beforeEach(() => {
		stockBook = new StockBook(registry);
	});

	test("should stock a new book successfully", async () => {
		const output = await stockBook.execute(INPUT_BOOK);

		expect(output.bookId).toBeDefined();
		expect(queue.length).toBe(1);
	});

	test("should throw DuplicatedBookError", async () => {
		await bookRepository.save(Book.create(INPUT_BOOK));

		const fn = () => stockBook.execute(INPUT_BOOK);

		expect(fn).rejects.toBeInstanceOf(DuplicatedBookError);
	});
});
