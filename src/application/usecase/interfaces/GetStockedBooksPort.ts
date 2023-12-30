import { BookError } from "../../../error/BookError";
import { Book } from "../../../domain/entities/Book";

export interface GetStockedBooksPort {
	execute(title: string): Promise<Book[] | BookError>;
}
