export interface BookFileStoragePort {
	storeCover(filename: string): Promise<void>;
}
