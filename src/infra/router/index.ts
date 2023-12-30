import { BookRouter } from "./BookRouter";
import { OrderRouter } from "./OrderRouter";

export const CONFIG_ROUTERS = [
	{ prefix: "/book", router: BookRouter },
	{ prefix: "/order", router: OrderRouter },
];
