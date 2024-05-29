import { Book } from "@/domain/entities/Book";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { BookRepository } from "../repository/BookRepository";
import { BookNotFoundError } from "@/error/BookError";
import { GenerativeAIServicePort } from "@/infra/generativeai/GenerativeAIService";

export class BookInformations {
	constructor(public book: Book, public suggestions: Book[]) {}
}

export interface GetBookInformationsPort {
	execute(bookId: string): Promise<BookInformations>;
}

export class GetBookInformations implements GetBookInformationsPort {
	private bookRepository: BookRepository;
	private generativeAIService: GenerativeAIServicePort;

	constructor(registry: DependencyRegistry) {
		this.bookRepository = registry.inject("bookRepository");
		this.generativeAIService = registry.inject("generativeAIService");
	}

	async execute(bookId: string): Promise<BookInformations> {
		const book = await this.bookRepository.get(bookId);

		if (book === null) throw new BookNotFoundError();

		const suggestions = await this.generativeAIService.getBooksSuggestions(
			book.category
		);

		return new BookInformations(book, suggestions);
	}
}
