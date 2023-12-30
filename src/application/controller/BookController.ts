import { StockBookPort } from "../usecase/interfaces/StockBookPort";
import { StockBookDTO } from "./dto/StockBookDto";
import { BookError } from "../../error/BookError";
import { Request, Response } from "express";
import { GetStockedBooksPort } from "../usecase/interfaces/GetStockedBooksPort";
import { UnexpectedError } from "@/error/ErrorBase";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

export class BookController {
	private readonly stockBook: StockBookPort;
	private readonly getStockedBooks: GetStockedBooksPort;

	constructor(readonly registry: DependencyRegistry) {
		this.stockBook = registry.inject("stockBook");
		this.getStockedBooks = registry.inject("getStockedBooks");
	}

	stock = async (req: Request, res: Response): Promise<any> => {
		try {
			const stockBookDTO: StockBookDTO = req.body;
			const bookOrError = await this.stockBook.execute(stockBookDTO);

			if (bookOrError instanceof BookError) {
				const { httpCode, ...errorMessage } = bookOrError;
				return res.status(httpCode).json(errorMessage);
			}

			return res.status(201).json(bookOrError);
		} catch (error) {
			console.log(error);

			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};

	search = async (req: Request, res: Response): Promise<any> => {
		try {
			const { title } = req.query;

			const booksOrError = await this.getStockedBooks.execute(title as string);

			if (booksOrError instanceof BookError) {
				const { httpCode, ...errorMessage } = booksOrError;

				return res.status(httpCode).json(errorMessage);
			}

			res.json(booksOrError);
		} catch (error) {
			console.log(error);

			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};
}
