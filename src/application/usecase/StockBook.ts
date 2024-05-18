import { StockBookDTO } from "../controller/dto/StockBookDto";
import { StockBookOutput, StockBookPort } from "./interfaces/StockBookPort";
import { BookFileStoragePort } from "../repository/BookFileStorage";
import { BookRepository } from "../repository/BookRepository";
import { DuplicatedBookError } from "@/error/BookError";
import { Book } from "@/domain/entities/Book";
import { randomUUID } from "crypto";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Queue } from "@/infra/queue/Queue";
import { BookStocked } from "@/domain/event/BookStocked";

export class StockBook implements StockBookPort {
	private readonly bookRepository: BookRepository;
	private readonly bookFileStorage: BookFileStoragePort;
	private readonly queue: Queue;
	private readonly idGenerator: () => string = randomUUID;

	constructor(registry: DependencyRegistry) {
		this.bookRepository = registry.inject("bookRepository");
		this.bookFileStorage = registry.inject("bookFileStorage");
		this.queue = registry.inject("queue");
	}

	execute = async (input: StockBookDTO): Promise<StockBookOutput> => {
		const bookOrNull = await this.bookRepository.getByTitleAndEdition(
			input.title,
			input.edition
		);

		if (bookOrNull !== null) {
			throw new DuplicatedBookError();
		}

		const book = Book.create(input, this.idGenerator);

		await this.bookFileStorage.storeCover(book.cover);
		await this.bookRepository.save(book);

		this.queue.publish(new BookStocked(book.id, book.unitPrice));

		return { bookId: book.id };
	};
}
