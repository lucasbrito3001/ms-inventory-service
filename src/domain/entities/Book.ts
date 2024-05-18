import { StockBookDTO } from "@/application/controller/dto/StockBookDto";
import { randomUUID } from "crypto";
import { DomainBase } from "../Base";

export class Book extends DomainBase {
	private constructor(
		public id: string,
		public title: string,
		public edition: number,
		public author: string,
		public release: string,
		public cover: string,
		public category: string,
		public quantity: number,
		public isVisible: boolean,
		public unitPrice: number
	) {
		super();
	}

	static create = (
		bookDTO: StockBookDTO,
		idGenerator: () => string = randomUUID
	): Book => {
		const id = idGenerator();

		const book = new Book(
			id,
			bookDTO.title,
			bookDTO.edition,
			bookDTO.author,
			bookDTO.release,
			this.coverFilename(bookDTO.title, bookDTO.edition, "jpg"),
			bookDTO.category,
			bookDTO.quantity,
			!!bookDTO.isVisible || false,
			this.formatMoneyToPersist(+bookDTO.unitPrice)
		);

		return book;
	};

	static instance = (
		id: string,
		title: string,
		edition: number,
		author: string,
		release: string,
		cover: string,
		category: string,
		quantity: number,
		isVisible: boolean,
		unitPrice: number
	): Book => {
		return new Book(
			id,
			title,
			edition,
			author,
			release,
			cover,
			category,
			quantity,
			isVisible,
			unitPrice
		);
	};

	static updatePrice = (book: Book, newUnitPrice: number): Book => {
		const bookUpdated = new Book(
			book.id,
			book.title,
			book.edition,
			book.author,
			book.release,
			book.cover,
			book.category,
			book.quantity,
			book.isVisible,
			this.formatMoneyToPersist(newUnitPrice)
		);

		return bookUpdated;
	};

	static coverFilename = (
		title: string,
		edition: number,
		extension: string
	): string => {
		return `${title}_${edition}ed.${extension}`
			.toLowerCase()
			.replace(/\s/g, "_");
	};
}
