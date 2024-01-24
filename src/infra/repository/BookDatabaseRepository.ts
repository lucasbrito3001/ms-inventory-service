import { In, Like, Repository } from "typeorm";
import { BookEntity } from "./entity/BookEntity";
import { BookRepository } from "@/application/repository/BookRepository";
import { Book } from "@/domain/entities/Book";

export class BookRepositoryDatabase implements BookRepository {
	constructor(private readonly bookRepository: Repository<BookEntity>) {}

	async save(book: Book | Book[]): Promise<void> {
		await this.bookRepository.insert(book);
	}

	async update(id: string, book: Book): Promise<void> {
		await this.bookRepository.update(id, book);
	}

	async batchUpdate(book: Book[]): Promise<void> {
		await this.bookRepository.save(book);
	}

	async get(id: string): Promise<Book | null> {
		const bookEntity = await this.bookRepository.findOne({
			where: { id },
		});

		if (bookEntity === null) return null;

		return new Book(
			bookEntity.id as string,
			bookEntity.title as string,
			bookEntity.edition as number,
			bookEntity.author as string,
			bookEntity.release as string,
			bookEntity.cover as string,
			bookEntity.quantity as number,
			bookEntity.isVisible as boolean,
			bookEntity.unitPrice as number
		);
	}

	async getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<Book | null> {
		const bookEntity = await this.bookRepository.findOne({
			where: { title, edition },
		});

		if (bookEntity === null) return null;

		return new Book(
			bookEntity.id as string,
			bookEntity.title as string,
			bookEntity.edition as number,
			bookEntity.author as string,
			bookEntity.release as string,
			bookEntity.cover as string,
			bookEntity.quantity as number,
			bookEntity.isVisible as boolean,
			bookEntity.unitPrice as number
		);
	}

	async search(title: string): Promise<Book[]> {
		const bookEntities = await this.bookRepository.find({
			where: {
				title: Like(`%${title}%`),
			},
		});

		return bookEntities.map(
			(entity) =>
				new Book(
					entity.id as string,
					entity.title as string,
					entity.edition as number,
					entity.author as string,
					entity.release as string,
					entity.cover as string,
					entity.quantity as number,
					entity.isVisible as boolean,
					entity.unitPrice as number
				)
		);
	}

	async searchByIds(ids: string[]): Promise<Book[]> {
		const bookEntities = await this.bookRepository.findBy({ id: In(ids) });

		return bookEntities.map(
			(entity) =>
				new Book(
					entity.id as string,
					entity.title as string,
					entity.edition as number,
					entity.author as string,
					entity.release as string,
					entity.cover as string,
					entity.quantity as number,
					entity.isVisible as boolean,
					entity.unitPrice as number
				)
		);
	}
}
