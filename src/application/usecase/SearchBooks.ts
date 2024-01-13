import { BookRepository } from "../repository/BookRepository";
import { BookNotFoundError } from "../../error/BookError";
import {
	SearchBooksOutput,
	SearchBooksPort,
} from "./interfaces/SearchBooksPort";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

export class SearchBooks implements SearchBooksPort {
	private readonly bookRepository: BookRepository;

	constructor(readonly registry: DependencyRegistry) {
		this.bookRepository = registry.inject("bookRepository");
	}

	execute = async (title: string): Promise<SearchBooksOutput> => {
		const books = await this.bookRepository.search(title);

		if (books.length === 0) throw new BookNotFoundError();
		
		return books;
	};
}
