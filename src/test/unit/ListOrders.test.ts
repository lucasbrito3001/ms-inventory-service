import { beforeEach, describe, expect, test } from "vitest";
import { ListOrders } from "@/application/usecase/ListOrders";
import { OrderMemoryRepository } from "../../infra/repository/mock/OrderMemoryRepository";
import { OrderError } from "../../error/OrderError";
import { INPUT_ORDER } from "../constants";
import { Order } from "../../domain/entities/Order";

describe("ListOrders", () => {
	let listOrders: ListOrders;
	let orderMemoryRepository: OrderMemoryRepository;

	beforeEach(() => {
		orderMemoryRepository = new OrderMemoryRepository();

		listOrders = new ListOrders(orderMemoryRepository);
	});

	test("should return OrderError with INVALID_DATE_RANGE name", async () => {
		const startDate = new Date("2023-01-02");
		const endDate = new Date("2023-01-01");

		const ordersOrError = await listOrders.execute(startDate, endDate);

		expect(ordersOrError).toStrictEqual(new OrderError("INVALID_DATE_RANGE"));
	});

	test("should return OrderError with ORDER_NOT_FOUND name", async () => {
		const startDate = new Date("2023-01-02");
		const endDate = new Date("2023-01-03");

		const ordersOrError = await listOrders.execute(startDate, endDate);

		expect(ordersOrError).toStrictEqual(new OrderError("ORDER_NOT_FOUND"));
	});

	test("should list orders successfully", async () => {
		const currentDate = new Date();

		const startDate = new Date(currentDate);
		startDate.setDate(startDate.getDate() - 1);

		const endDate = new Date(currentDate);
		endDate.setDate(endDate.getDate() + 1);

		await orderMemoryRepository.save(INPUT_ORDER);

		const orders = (await listOrders.execute(startDate, endDate)) as Order[];

		expect(orders[0] instanceof Order).toBeTruthy();
	});
});
