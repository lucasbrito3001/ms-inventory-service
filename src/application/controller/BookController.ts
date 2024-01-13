import { StockBookPort } from "../usecase/interfaces/StockBookPort";
import { StockBookDTO, StockBookDTOSchema } from "./dto/StockBookDto";
import {
	BookError,
	InvalidBookInputError,
	InvalidTitleError,
} from "../../error/BookError";
import { NextFunction, Request, Response } from "express";
import { SearchBooksPort } from "../usecase/interfaces/SearchBooksPort";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Logger } from "@/infra/log/Logger";
import { UpdatePriceDTO, UpdatePriceDTOSchema } from "./dto/UpdatePriceDto";
import { UpdatePricePort } from "../usecase/interfaces/UpdatePricePort";

export class BookController {
	private readonly logger: Logger;
	private readonly _stockBook: StockBookPort;
	private readonly _searchBooks: SearchBooksPort;
	private readonly _updatePrice: UpdatePricePort;

	constructor(readonly registry: DependencyRegistry) {
		this.logger = registry.inject("logger");
		this._stockBook = registry.inject("stockBook");
		this._searchBooks = registry.inject("searchBooks");
		this._updatePrice = registry.inject("updatePrice");
	}

	stock = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const stockBookDTO: StockBookDTO = req.body;

			this.logger.logUseCase(
				"StockBook",
				`Book: ${stockBookDTO.title} - ${stockBookDTO.edition}ed / Quantity: ${stockBookDTO.quantity}`
			);

			const schemaValidation = StockBookDTOSchema.safeParse(stockBookDTO);

			if (!schemaValidation.success) {
				throw new InvalidBookInputError(schemaValidation.error.issues);
			}

			const output = await this._stockBook.execute(stockBookDTO);

			return res.status(201).json(output);
		} catch (error) {
			next(error);
		}
	};

	updateBookPrice = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const id: string = req.params.id;
			const { unitPrice }: UpdatePriceDTO = req.body;

			this.logger.logUseCase(
				"UpdatePrice",
				`Book id: ${id} - price: ${unitPrice}`
			);

			const schemaValidation = UpdatePriceDTOSchema.safeParse({
				id,
				unitPrice,
			});

			if (!schemaValidation.success) {
				throw new InvalidBookInputError(schemaValidation.error.issues);
			}

			await this._updatePrice.execute(id, unitPrice);

			return res.status(200).json(null);
		} catch (error) {
			next(error);
		}
	};

	search = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const { title } = req.query;

			this.logger.logUseCase("SearchBooks", `Title: ${title}`);

			if (!title) throw new InvalidTitleError();

			const books = await this._searchBooks.execute(title as string);

			return res.status(200).json(books);
		} catch (error) {
			next(error);
		}
	};
}
