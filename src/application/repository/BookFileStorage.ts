export interface BookFileStoragePort {
	storeCover(filename: string): Promise<string>;
}
