import { Book } from "../../domain/entities/Book";
import { BookEntity } from "../../infra/repository/entity/BookEntity";

export interface BookRepository {
	save(book: Book | Book[]): Promise<void>;
	update(id: string, book: Book): Promise<void>;
	batchUpdate(book: Book[]): Promise<void>;
	search(title: string): Promise<Book[]>;
	get(id: string): Promise<Book | null>;
	searchByIds(ids: string[]): Promise<Book[]>;
	getByTitleAndEdition(title: string, edition: number): Promise<Book | null>;
}
