import { ErrorsData, ErrorBase } from "@/error/ErrorBase";
import {
	DataSource,
	DataSourceOptions,
	EntityTarget,
	ObjectLiteral,
} from "typeorm";
import { BookEntity } from "./repository/entity/Book.entity";
import { GeneralLogger } from "./log/GeneralLogger";
import { Logger } from "./log/Logger";
import { join } from "path";

type DataSourceErrorNames =
	| "BAD_DATASOURCE_CONFIG"
	| "DATASOURCE_CONNECTION_CLOSED"
	| "UNDEFINED_CONNECTION";

export const DATASOURCE_ERRORS: ErrorsData<DataSourceErrorNames> = {
	BAD_DATASOURCE_CONFIG: {
		message: "Error with database configuration.",
		httpCode: 0,
	},
	DATASOURCE_CONNECTION_CLOSED: {
		message: "Can't close the connection, it's already closed.",
		httpCode: 0,
	},
	UNDEFINED_CONNECTION: {
		message: "Can't handle the database, the connection is not established.",
		httpCode: 0,
	},
};

export class DataSourceError extends ErrorBase {
	constructor(errorName: DataSourceErrorNames) {
		super(
			errorName,
			DATASOURCE_ERRORS[errorName].message,
			DATASOURCE_ERRORS[errorName].httpCode
		);
	}
}

export class DataSourceConnection {
	private connection: DataSource | undefined;
	private readonly logger: Logger = new GeneralLogger();

	getConfig(): DataSourceOptions | undefined {
		const options: DataSourceOptions = {
			type: "mysql",
			url: process.env.DB_CONNECTION_STRING || "",
			entities: [join(__dirname, "..", "repository", "entity", "*.entity.ts")],
			synchronize: process.env.NODE_ENV !== "prd",
			logging: process.env.NODE_ENV !== "prd",
		};

		const config = options;

		return config;
	}

	async initialize(): Promise<void> {
		try {
			this.logger.log("[DATASOURCE] - Connecting to database...");
			const config = this.getConfig();

			if (config === undefined)
				throw new DataSourceError("BAD_DATASOURCE_CONFIG");

			this.connection = await new DataSource(config).initialize();
			this.logger.log("[DATASOURCE] - Connected succesfully!");
		} catch (error) {
			const anyError = error as any;
			throw new Error(anyError.message);
		}
	}

	getRepository(entity: EntityTarget<ObjectLiteral>) {
		if (this.connection === undefined)
			throw new DataSourceError("UNDEFINED_CONNECTION");

		return this.connection.getRepository(entity);
	}

	async close(): Promise<void> {
		if (this.connection === undefined) return;

		await this.connection?.destroy();
	}
}
