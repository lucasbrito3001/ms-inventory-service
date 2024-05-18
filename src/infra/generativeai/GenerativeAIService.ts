import { Book } from "@/domain/entities/Book";

export interface GenerativeAIServicePort {
	getBooksSuggestions(category: string): Promise<Book[]>;
}
