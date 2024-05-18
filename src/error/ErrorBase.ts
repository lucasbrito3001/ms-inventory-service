export type ErrorsData<T extends string> = {
	[K in T]: {
		message: string;
		httpCode: number;
		cause?: any;
	};
};

export class ErrorBase implements Error {
	name: string;
	message: string;
	httpCode: number;
	cause?: any;

	constructor(name: string, message: string, httpCode: number, cause?: any) {
		this.name = name;
		this.message = message;
		this.httpCode = httpCode;
		this.cause = cause;
	}
}

export class UnexpectedError extends ErrorBase {
	constructor() {
		super("UNEXPECTED_ERROR", "An unexpected error occurred.", 500);
	}
}
