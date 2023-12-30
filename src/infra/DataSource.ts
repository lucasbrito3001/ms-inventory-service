import { ErrorsData, ErrorBase } from "@/error/ErrorBase";
import {
	DataSource,
	DataSourceOptions,
	EntityTarget,
	ObjectLiteral,
} from "typeorm";
import { BookEntity } from "./repository/entity/BookEntity";

type DataSourceErrorNames =
	| "BAD_DATASOURCE_CONFIG"
	| "DATASOURCE_CONNECTION_CLOSED";

export const DATASOURCE_ERRORS: ErrorsData<DataSourceErrorNames> = {
	BAD_DATASOURCE_CONFIG: {
		message: "Error with database configuration.",
		httpCode: 0,
	},
	DATASOURCE_CONNECTION_CLOSED: {
		message: "Can't close the connection, it's already closed.",
		httpCode: 0,
	},
};

export class DataSourceError extends ErrorBase<DataSourceErrorNames> {
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

	getConfig(): DataSourceOptions | undefined {
		const options: DataSourceOptions = {
			type: "mysql",
			port: 3306,
			host: process.env.DS_HOST || "",
			username: process.env.DS_USER || "",
			password: process.env.DS_PASS || "",
			database: process.env.DS_DATABASE || "",
			entities: [BookEntity],
			synchronize: process.env.NODE_ENV !== "prd",
			logging: process.env.NODE_ENV !== "prd",
		};

		if (Object.values(options).some((opt) => !opt)) return undefined;

		return options;
	}

	async initialize(): Promise<void> {
		const config = this.getConfig();

		if (config === undefined)
			throw new DataSourceError("BAD_DATASOURCE_CONFIG");

		this.connection = await new DataSource(config).initialize();
	}

	getRepository(entity: EntityTarget<ObjectLiteral>) {
		if (this.connection === undefined)
			throw new DataSourceError("DATASOURCE_CONNECTION_CLOSED");

		return this.connection.getRepository(entity);
	}

	async close(): Promise<void> {
		if (this.connection === undefined)
			throw new DataSourceError("DATASOURCE_CONNECTION_CLOSED");

		await this.connection?.destroy();
	}
}
