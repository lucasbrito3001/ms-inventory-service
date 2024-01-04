import { BookFileStoragePort } from "../../application/repository/BookFileStorage";
import { DependencyRegistry } from "../DependencyRegistry";
import { FileStorageBucket, FileStorageBucketOptions } from "../FileStorage";

export class BookCoverCloudFileStorage implements BookFileStoragePort {
	private readonly bookCoverBucket: FileStorageBucket;

	constructor(readonly registry: DependencyRegistry) {
		this.bookCoverBucket = registry.inject("bookCoverBucket");
	}

	storeCover = async (filename: string): Promise<void> => {
		const uploadOptions: FileStorageBucketOptions = {
			destination: filename,
		};

		await this.bookCoverBucket.upload(filename, `/tmp/uploads/${filename}`);
	};
}
