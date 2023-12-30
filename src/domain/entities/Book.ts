import { StockBookDTO } from "@/application/controller/dto/StockBookDto";
import { randomUUID } from "crypto";

export class Book {
	constructor(
		public id: string,
		public title: string,
		public edition: number,
		public author: string,
		public release: string,
		public cover: string,
		public quantity: number,
		public isVisible: boolean
	) {}

	static register = (
		bookDTO: StockBookDTO,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): Book => {
		const id = idGenerator();

		const book = new Book(
			id,
			bookDTO.title,
			bookDTO.edition,
			bookDTO.author,
			bookDTO.release,
			this.coverFilename(bookDTO.title, bookDTO.edition, "jpg"),
			bookDTO.quantity,
			bookDTO.isVisible || false
		);

		return book;
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
