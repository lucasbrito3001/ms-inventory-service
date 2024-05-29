import { Book } from "@/domain/entities/Book";
import { GenerativeAIServicePort } from "../GenerativeAIService";

export class MockGenerativeAIService implements GenerativeAIServicePort {
	async getBooksSuggestions(category: string): Promise<Book[]> {
		return [
			Book.instance(
				"0",
				"Domain-Driven Design",
				1,
				"Eric Evans",
				"2016-12-16",
				"mock-cover.url",
				"technology",
				10,
				true,
				100
			),
		];
	}
}
