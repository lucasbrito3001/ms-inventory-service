import { Router } from "express";
import { BookController } from "@/application/controller/BookController";
import { DependencyRegistry } from "../DependencyRegistry";
import { uploader } from "@/index";

export class BookRouter {
	private bookController: BookController;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.bookController = new BookController(registry);
	}

	expose() {
		this.router.post(
			"/stock_book",
			uploader.single("cover"),
			this.bookController.stock
		);
		this.router.get("/search_books", this.bookController.search);
	}
}
