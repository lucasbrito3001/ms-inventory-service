import { Book } from "../../domain/entities/Book";
import { BookEntity } from "../../infra/repository/entity/BookEntity";

export interface BookRepository {
	save(book: Book): Promise<void>;
	update(id: string, book: Book): Promise<void>;
	search(title: string): Promise<BookEntity[]>;
	get(id: string): Promise<BookEntity | null>;
	searchByIds(ids: string[]): Promise<BookEntity[]>;
	getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<BookEntity | null>;
}
