import {
	StockBookDTO,
	StockBookDTOSchema,
} from "../controller/dto/StockBookDto";
import { StockBookOutput, StockBookPort } from "./interfaces/StockBookPort";
import { BookFileStoragePort } from "../repository/BookFileStorage";
import { BookRepository } from "../repository/BookRepository";
import { BookError } from "@/error/BookError";
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
		this.bookFileStorage = registry.inject("bookCloudFileStorage");
		this.queue = registry.inject("queue");
	}

	execute = async (stockBookDTO: StockBookDTO): Promise<StockBookOutput> => {
		const book = Book.register(stockBookDTO, this.idGenerator);

		await this.bookFileStorage.storeCover(book.cover);
		await this.bookRepository.save(book);

		this.queue.publish("bookStocked", new BookStocked(book.id, book.unitPrice));

		return { bookId: book.id };
	};
}
