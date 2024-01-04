import { OrderRegistered } from "@/domain/event/OrderRegistered";

export interface CheckOrderItemsPort {
	execute(order: OrderRegistered): Promise<void>;
}
