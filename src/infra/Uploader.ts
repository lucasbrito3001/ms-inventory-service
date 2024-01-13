import { Book } from "@/domain/entities/Book";
import multer, { Multer } from "multer";

export class Uploader {
	public readonly instance: Multer;

	constructor() {
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, "/tmp/uploads");
			},
			filename: function (req, file, cb) {
				const { title, edition } = req.body;
				const filename = Book.coverFilename(title, edition, "jpg");
				req.body.cover = filename;
				cb(null, filename);
			},
		});
        
		this.instance = multer({ storage });
	}
}
