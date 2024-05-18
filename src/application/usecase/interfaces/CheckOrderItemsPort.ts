import { OrderRegisteredMessage } from "@/domain/event/OrderRegistered";

export interface CheckOrderItemsPort {
	execute(order: OrderRegisteredMessage): Promise<void>;
}
