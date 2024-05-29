import { ErrorBase } from "./ErrorBase";

export class DuplicatedBookError extends ErrorBase {
	constructor() {
		super(
			"DUPLICATED_BOOK",
			"A book with this combination of title and edition already exists.",
			400
		);
	}
}

export class InvalidBookInputError extends ErrorBase {
	constructor(cause?: any) {
		super("INVALID_INPUT", "The input is invalid.", 400, cause);
	}
}

export class BookNotFoundError extends ErrorBase {
	constructor() {
		super("BOOK_NOT_FOUND", "No book was found.", 400);
	}
}

export class InvalidTitleError extends ErrorBase {
	constructor() {
		super("INVALID_TITLE", "The title is required.", 400);
	}
}
