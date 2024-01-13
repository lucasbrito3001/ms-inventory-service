import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { CheckOrderItemsPort } from "@/application/usecase/interfaces/CheckOrderItemsPort";
import { OrderRegistered } from "@/domain/event/OrderRegistered";

export class OrderRegisteredSub implements QueueSubscriber {
	public queueName = "orderRegistered";
	private readonly useCase: CheckOrderItemsPort;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("checkOrderItems");
		this.logger = registry.inject("logger");
	}

	private logMessage = (bookId: string): void => {
		this.logger.logEvent(
			"BookStocked",
			`Adding book ${bookId} to the database`
		);
	};

	public callbackFunction = async (message: OrderRegistered) => {
		this.logMessage(message.id);
		this.useCase.execute(message);
	};
}
