import { StockBookDTO } from "@/application/controller/dto/StockBookDto";

export interface StockBookPort {
	execute(stockBookDTO: StockBookDTO): Promise<StockBookOutput>;
}

export type StockBookOutput = {
	bookId: string;
};
