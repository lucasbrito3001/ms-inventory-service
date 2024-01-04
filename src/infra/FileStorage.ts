import { Storage, UploadOptions, UploadResponse } from "@google-cloud/storage";
import { createReadStream } from "fs";

export type FileStorageCredentials = {
	type: string;
	project_id: string;
	private_key_id: string;
	private_key: string;
	client_email: string;
	client_id: string;
	auth_uri: string;
	token_uri: string;
	auth_provider_x509_cert_url: string;
	client_x509_cert_url: string;
	universe_domain: string;
};

export type FileStorageBucketOptions = UploadOptions;

export type FileStorageBucket = {
	upload(filename: string, path: string): Promise<void>;
	// file(filename: string): File;
};

export class FileStorage {
	public storage: Storage;

	constructor(credentials: FileStorageCredentials) {
		this.storage = new Storage({ credentials });
	}

	bucket = (bucketName: string): FileStorageBucket => {
		const storageBucket = this.storage.bucket(bucketName);

		const upload = async (filename: string, path: string) => {
			try {
				const file = storageBucket.file(filename);
				const stream = createReadStream(path);

				await stream.pipe(file.createWriteStream());
			} catch (error) {
				const anyError = error as any;
				throw new Error(`Error uploading file to bucket: ${anyError.message}`);
			}
		};

		return {
			upload,
		};
	};
}
