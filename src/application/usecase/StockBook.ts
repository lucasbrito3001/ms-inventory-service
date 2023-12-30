import {
	StockBookDTO,
	StockBookDTOSchema,
} from "../controller/dto/StockBookDto";
import { StockBookPort } from "./interfaces/StockBookPort";
import { BookFileStoragePort } from "../repository/BookFileStorage";
import { BookRepository } from "../repository/BookRepository";
import { BookError } from "@/error/BookError";
import { Book } from "@/domain/entities/Book";

export class StockBook implements StockBookPort {
	constructor(
		private readonly bookRepository: BookRepository,
		private readonly bookFileStorage: BookFileStoragePort,
		private readonly idGenerator: () => `${string}-${string}-${string}-${string}-${string}`
	) {}

	execute = async (stockBookDTO: StockBookDTO): Promise<Book | BookError> => {
		const schemaValidation = StockBookDTOSchema.safeParse(stockBookDTO);

		if (!schemaValidation.success)
			return new BookError("INVALID_DTO", schemaValidation.error.issues);

		const duplicatedBook = await this.bookRepository.getByTitleAndEdition(
			schemaValidation.data.title,
			schemaValidation.data.edition
		);

		if (duplicatedBook !== null) return new BookError("DUPLICATED_BOOK");

		const book = Book.register(schemaValidation.data, this.idGenerator);

		await this.bookFileStorage.storeCover(book.cover);
		await this.bookRepository.save(book);

		return book;
	};
}
