import { BookFileStoragePort } from "../../../application/repository/BookFileStorage";

export class BookLocalFileStorage implements BookFileStoragePort {
	async storeCover(filename: string): Promise<string> {
		return filename;
	}
}
