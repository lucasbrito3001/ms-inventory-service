import { StockBookDTO } from "@/resources/book/controller/dto/StockBookDto";
import { BookError } from "../../../error/BookError";
import { Book } from "../../../domain/entities/Book";

export interface StockBookPort {
	execute(stockBookDTO: StockBookDTO): Promise<Book | BookError>;
}
