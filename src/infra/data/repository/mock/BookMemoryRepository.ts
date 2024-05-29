import { BookRepository } from "@/application/repository/BookRepository";
import { StockBookDTO } from "@/application/controller/dto/StockBookDto";
import { Book } from "@/domain/entities/Book";

export class BookMemoryRepository implements BookRepository {
	private books: Book[] = [];

	async batchUpdate(books: Book[]): Promise<void> {
		this.books = this.books.map((book, id) => {
			const upBook = books.find((upBook) => upBook.id === book.id);
			return upBook ? upBook : book;
		});
	}

	async save(book: Book): Promise<void> {
		this.books.push(book);
	}

	async update(id: string, stockBookDTO: StockBookDTO): Promise<void> {
		const book = Book.create(stockBookDTO, () => "0-0-0-0-0");
		const index = this.books.findIndex((stock) => stock.id === id);
		this.books[index] = book;
	}

	async get(id: string): Promise<Book | null> {
		return this.books.find((stock) => stock.id === id) || null;
	}

	async getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<Book | null> {
		return (
			this.books.find(
				(book) => book.title === title && book.edition === edition
			) || null
		);
	}

	async search(title: string): Promise<Book[]> {
		return this.books.filter((book) => book.title === title);
	}

	async searchByIds(ids: string[]): Promise<Book[]> {
		return this.books.filter((book) => ids.includes(book.id));
	}

	async getAllToAI(category: string): Promise<Book[]> {
		return this.books.filter((book) => book.category === category);
	}
}
