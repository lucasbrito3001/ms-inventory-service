import { In, Like, Repository } from "typeorm";
import { StockBookDTO } from "../../application/controller/dto/StockBookDto";
import { BookEntity } from "./entity/BookEntity";
import { BookRepository } from "@/application/repository/BookRepository";

export class BookRepositoryDatabase implements BookRepository {
	constructor(private readonly bookRepository: Repository<BookEntity>) {}

	async save(stockBookDTO: StockBookDTO): Promise<void> {
		await this.bookRepository.insert(stockBookDTO);
	}

	async update(id: string, stockBookDTO: StockBookDTO): Promise<void> {
		await this.bookRepository.update(id, stockBookDTO);
	}

	async get(id: string): Promise<BookEntity | null> {
		return await this.bookRepository.findOne({
			where: { id },
		});
	}

	async getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<BookEntity | null> {
		return await this.bookRepository.findOne({
			where: { title, edition },
		});
	}

	async search(title: string): Promise<BookEntity[]> {
		return await this.bookRepository.find({
			where: {
				title: Like(`%${title}%`),
			},
		});
	}

	async searchByIds(ids: string[]): Promise<BookEntity[]> {
		return await this.bookRepository.findBy({ id: In(ids) });
	}
}
