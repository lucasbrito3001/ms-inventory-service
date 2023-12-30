import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { StockBookDTO } from "@/application/controller/dto/StockBookDto";

export const INPUT_ORDER: RegisterOrderDTO = {
	country: "Mock Country",
	state: "MS",
	city: "Mock City",
	district: "Mock District",
	street: "Mock Street",
	number: 100,
	complement: "apto. 100",
	zipCode: "00000000",
	books: ["0-0-0-0-0"],
};

export const INPUT_BOOK: StockBookDTO = {
	title: "Domain-Driven Design",
	edition: 1,
	author: "Eric Evans",
	release: "2003-08-22T03:00:00.000Z",
	cover: "https://m.media-amazon.com/images/I/51OWGtzQLLL._SY342_.jpg",
	quantity: 15,
	isVisible: true,
};
