import { BookFileStoragePort } from "../../application/repository/BookFileStorage";
import { FileStorageBucket, FileStorageBucketOptions } from "../FileStorage";

export class BookCoverCloudFileStorage implements BookFileStoragePort {
	constructor(private readonly bookCoverBucket: FileStorageBucket) {}

	storeCover = async (filename: string): Promise<string> => {
		const uploadOptions: FileStorageBucketOptions = {
			destination: filename,
		};

		const [file] = await this.bookCoverBucket.upload(
			`/tmp/uploads/${filename}`,
			uploadOptions
		);

		return file.baseUrl || "";
	};
}
