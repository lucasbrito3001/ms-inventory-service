import { OrderRepository } from "@/application/repository/OrderRepository";
import { Order } from "@/domain/entities/Order";
import { OrderEntity } from "../entity/OrderEntity";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";

export class OrderMemoryRepository implements OrderRepository {
	private orders: OrderEntity[] = [];

	async save(registerOrderDTO: RegisterOrderDTO): Promise<void> {
		const order = Order.register(registerOrderDTO);
		this.orders.push(order as unknown as OrderEntity);
	}

	async get(id: string): Promise<OrderEntity | null> {
		return this.orders.find((order) => order.id === id) || null;
	}

	async list(initialDate: Date, endDate: Date): Promise<OrderEntity[]> {
		const initialDateMs = new Date(initialDate).getTime();
		const endDateMs = new Date(endDate).getTime();

		return this.orders.filter((order) => {
			const createdAtMs = new Date(order.createdAt as Date).getTime();
			return createdAtMs >= initialDateMs && createdAtMs <= endDateMs;
		});
	}
}
