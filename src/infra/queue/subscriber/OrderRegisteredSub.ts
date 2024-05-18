import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { CheckOrderItemsPort } from "@/application/usecase/interfaces/CheckOrderItemsPort";
import { OrderRegisteredMessage } from "@/domain/event/OrderRegistered";

export class OrderRegisteredSub implements QueueSubscriber {
	public queueName = "orderRegistered";
	private readonly useCase: CheckOrderItemsPort;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("checkOrderItems");
		this.logger = registry.inject("logger");
	}

	private logMessage = (orderId: string): void => {
		this.logger.logEvent(
			"OrderRegistered",
			`Checking order items stock: ${orderId}`
		);
	};

	public callbackFunction = async (message: OrderRegisteredMessage) => {
		this.logMessage(message.orderId);
		await this.useCase.execute(message);
	};
}
