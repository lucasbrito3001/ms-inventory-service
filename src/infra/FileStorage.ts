import { Storage, UploadOptions, UploadResponse } from "@google-cloud/storage";

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
	upload(
		path: string,
		options: FileStorageBucketOptions
	): Promise<UploadResponse>;
};

export class FileStorage {
	public storage: Storage;

	constructor(credentials: FileStorageCredentials) {
		this.storage = new Storage({ credentials });
	}

	bucket = (bucketName: string): FileStorageBucket => {
		const storageBucket = this.storage.bucket(bucketName);

		return {
			upload: (path: string, options: FileStorageBucketOptions) =>
				storageBucket.upload(path, options),
		};
	};
}
