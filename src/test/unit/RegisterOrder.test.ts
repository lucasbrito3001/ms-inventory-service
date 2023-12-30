import { beforeEach, describe, expect, test } from "vitest";
import { RegisterOrder } from "@/application/usecase/RegisterOrder";
import { OrderMemoryRepository } from "../../infra/repository/mock/OrderMemoryRepository";
import { INPUT_BOOK, INPUT_ORDER } from "../constants";
import { Order } from "../../domain/entities/Order";
import { OrderError } from "../../error/OrderError";
import { StockBook } from "@/application/usecase/StockBook";
import { BookLocalFileStorage } from "@/infra/repository/mock/BookLocalFileStorage";
import { BookMemoryRepository } from "@/infra/repository/mock/BookMemoryRepository";
import { Queue } from "@/infra/queue/Queue";
import { MockQueue } from "@/infra/queue/mock/MockQueue";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

describe("RegisterOrder", () => {
	let registerOrder: RegisterOrder;
	let bookMemoryRepository: BookMemoryRepository;

	beforeEach(() => {
		const registry = new DependencyRegistry();

		bookMemoryRepository = new BookMemoryRepository();

		registry.push("orderRepository", new OrderMemoryRepository());
		registry.push("bookRepository", bookMemoryRepository);
		registry.push("bookFileStorage", new BookLocalFileStorage());
		registry.push("queue", new MockQueue());

		registerOrder = new RegisterOrder(registry);
	});

	test("should register a new order successfully", async () => {
		await bookMemoryRepository.save(INPUT_BOOK);
		const order = await registerOrder.execute(INPUT_ORDER);

		expect(order.orderId).toBeDefined();
	});
});
