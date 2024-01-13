import { Book } from "@/domain/entities/Book";
import { describe, expect, test } from "vitest";
import { INPUT_BOOK } from "../constants";
import { DomainBase } from "@/domain/Base";

describe("[Domain - Book]", () => {
	test("should create a new book with a new uuid and formatted price", async () => {
		const book = Book.create(INPUT_BOOK, () => "0");
		const unitPrice = DomainBase.formatMoneyToPersist(INPUT_BOOK.unitPrice);
		const cover = Book.coverFilename(
			INPUT_BOOK.title,
			INPUT_BOOK.edition,
			"jpg"
		);

		expect(book).toBeInstanceOf(Book);
		expect(book.unitPrice).toBe(unitPrice);
		expect(book.cover).toBe(cover);
	});

	test("should format cover filename", () => {
		const filename = Book.coverFilename("domain-driven design", 3, "png");

		expect(filename).toBe("domain-driven_design_3ed.png");
	});

	test("should update the book price", () => {
		const book = Book.create(INPUT_BOOK, () => "0");
		const bookUpdated = Book.updatePrice(book, 78.9);
		const unitPrice = DomainBase.formatMoneyToPersist(78.9);

		expect(bookUpdated).toBeInstanceOf(Book);
		expect(bookUpdated.unitPrice).toBe(unitPrice);
	});
});
