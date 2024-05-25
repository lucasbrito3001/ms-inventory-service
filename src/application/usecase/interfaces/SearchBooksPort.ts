import { Book } from "@/domain/entities/Book";

export interface SearchBooksPort {
	execute(title: string): Promise<SearchBooksOutput>;
}

export type SearchBooksOutput = Book[];
