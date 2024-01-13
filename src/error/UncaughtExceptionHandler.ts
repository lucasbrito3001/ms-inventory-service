import { Response } from "express";
import { ErrorBase } from "./ErrorBase";
import { Logger } from "@/infra/log/Logger";

export class UncaughtExceptionHandler {
	private readonly response: Response;
	private readonly logger: Logger;

	constructor(res: Response, logger: Logger) {
		this.response = res;
		this.logger = logger;
	}

	handle = (error: any) => {
		if (error instanceof ErrorBase) {
			this.logger.handledError(error.name, error.message);

			const { httpCode, cause, ...errorBase } = error;
			this.response.status(httpCode).json({
				...errorBase,
				...(process.env.NODE_ENV !== "production" && { cause }),
			});
		}
	};
}
