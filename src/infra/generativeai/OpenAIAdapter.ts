import { Book } from "@/domain/entities/Book";
import OpenAI from "openai";
import { GenerativeAIServicePort } from "./GenerativeAIService";
import { INPUT_BOOK } from "test/constants";
import { BookRepository } from "@/application/repository/BookRepository";
import { DependencyRegistry } from "../DependencyRegistry";
import { StockBookDTO } from "@/application/controller/dto/StockBookDto";
import { UnexpectedError } from "@/error/ErrorBase";
import { BookNotFoundError } from "@/error/BookError";

process.env.OPENAI_API_ENVIRONMENT = "nodejs";

export class OpenAIAdapter implements GenerativeAIServicePort {
	private client: OpenAI;
	private bookRepository: BookRepository;

	constructor(registry: DependencyRegistry) {
		this.client = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
			dangerouslyAllowBrowser: true,
		});
		this.bookRepository = registry.inject("bookRepository");
	}

	async getBooksSuggestions(category: string): Promise<Book[]> {
		const booksBase = await this.bookRepository.getAllToAI(category);

		let message = `Hello, I want to give book suggestions to my clients who consume my portfolio, the idea is to convince them to buy some new books.\n
The following books represent my library book portfolio:
${booksBase
	.map((book) => `- ${book.title}, ${book.edition}ed - ${book.author}\n`)
	.join("")}
The following books were the ones my client purchased last year:\n
- Domain-Drive Design
- The Phoenix Project

Based on the books my client has purchased in the last year, which books in my portfolio do you think my client is most likely to purchase? Please only give me books that make sense with the books he bought
Your response needs to have the following format { title: string, edition: number }`;

		const chatCompletion = await this.client.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant designed to output JSON.",
				},
				{
					role: "user",
					content: message,
				},
			],
			model: "gpt-3.5-turbo-0125",
			response_format: { type: "json_object" },
		});

		type JsonResponse = {
			title: string;
			edition: number;
		};

		const [recommended_books] = Object.values(
			JSON.parse(chatCompletion.choices[0].message.content as string)
		) as JsonResponse[][];

		const booksToReturn: Book[] = [];

		for (let recommended_book of recommended_books) {
			const book = await this.bookRepository.getByTitleAndEdition(
				recommended_book.title,
				recommended_book.edition
			);

			if (book !== null) booksToReturn.push(book);
		}

		return booksToReturn;
	}
}
