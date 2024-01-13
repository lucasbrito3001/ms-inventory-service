import { Router } from "express";
import { BookController } from "@/application/controller/BookController";
import { DependencyRegistry } from "../DependencyRegistry";
import { Uploader } from "../Uploader";

export class BookRouter {
	private bookController: BookController;
	private uploader: Uploader;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.bookController = new BookController(registry);
		this.uploader = new Uploader();
	}

	expose() {
		this.router.post(
			"/stock_book",
			this.uploader.instance.single("cover"),
			this.bookController.stock
		);
		this.router.get("/search_books", this.bookController.search);
		this.router.put("/update_price/:id", this.bookController.updateBookPrice)
	}
}
