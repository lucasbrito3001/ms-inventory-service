import { BookRepository } from "@/application/repository/BookRepository";
import {
	BookInformations,
	GetBookInformations,
	GetBookInformationsPort,
} from "@/application/usecase/GetBookInformations";
import { BookNotFoundError } from "@/error/BookError";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { MockGenerativeAIService } from "@/infra/generativeai/mock/MockGenerativeAIService";
import { BookMemoryRepository } from "@/infra/repository/mock/BookMemoryRepository";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { INPUT_BOOK } from "../constants";
import { Book } from "@/domain/entities/Book";

describe("[Use Case - GetBookInformations]", () => {
	let getBookInformations: GetBookInformationsPort;

	let bookRepository: BookRepository;

	const registry: DependencyRegistry = new DependencyRegistry();

	beforeAll(() => {
		bookRepository = new BookMemoryRepository();

		registry
			.push("bookRepository", bookRepository)
			.push("generativeAIService", new MockGenerativeAIService())
			.push("getBookInformations", new GetBookInformations(registry));
	});

	beforeEach(() => {
		getBookInformations = new GetBookInformations(registry);
	});

	test("should return BookNotFoundError when trying to get informations of an inexistent book", () => {
		const fn = () => getBookInformations.execute("0");

		expect(fn).rejects.toBeInstanceOf(BookNotFoundError);
	});

	test("should return book informations successfully", async () => {
		const book = Book.create(INPUT_BOOK);
		await bookRepository.save(book);

		const bookInformations = await getBookInformations.execute(book.id);

		expect(bookInformations).toBeInstanceOf(BookInformations);
	});
});
