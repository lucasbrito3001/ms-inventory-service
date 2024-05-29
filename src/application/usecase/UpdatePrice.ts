import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { BookRepository } from "../repository/BookRepository";
import { UpdatePricePort } from "./interfaces/UpdatePricePort";
import { BookNotFoundError } from "@/error/BookError";
import { Book } from "@/domain/entities/Book";
import { Queue } from "@/infra/queue/Queue";
import { PriceUpdated } from "@/domain/event/PriceUpdated";

export class UpdatePrice implements UpdatePricePort {
	private readonly bookRepository: BookRepository;
	private readonly queue: Queue;

	constructor(readonly dependency: DependencyRegistry) {
		this.bookRepository = dependency.inject("bookRepository");
		this.queue = dependency.inject("queue");
	}

	async execute(id: string, unitPrice: number): Promise<void> {
		const book = await this.bookRepository.get(id);
		
		if (!book) throw new BookNotFoundError();

		const bookUpdated = Book.updatePrice(book, unitPrice);

		await this.bookRepository.update(id, bookUpdated);
		this.queue.publish(new PriceUpdated(id, unitPrice));

		return;
	}
}
