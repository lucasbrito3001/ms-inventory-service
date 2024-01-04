import { StockBookDTO } from "@/application/controller/dto/StockBookDto";

export interface PriceUpdatedPort {
	execute(updatedBookDTO: StockBookDTO): Promise<StockBookOutput>;
}

export type StockBookOutput = {
	bookId: string;
};
