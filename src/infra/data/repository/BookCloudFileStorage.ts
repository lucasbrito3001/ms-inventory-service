import { BookFileStoragePort } from "@/application/repository/BookFileStorage";
import {
	FileStorageBucket,
	FileStorageBucketOptions,
} from "@/infra/FileStorage";

export class BookCoverCloudFileStorage implements BookFileStoragePort {
	private readonly bookCoverBucket: FileStorageBucket;

	constructor(bucket: FileStorageBucket) {
		this.bookCoverBucket = bucket;
	}

	storeCover = async (filename: string): Promise<void> => {
		const uploadOptions: FileStorageBucketOptions = {
			destination: filename,
		};

		await this.bookCoverBucket.upload(filename, `/tmp/uploads/${filename}`);
	};
}
