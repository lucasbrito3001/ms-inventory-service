import { Logger } from "./Logger";

export class GeneralLogger implements Logger {
	logSubscriber(queueName: string): void {
		console.log(`[QUEUE_SUBSCRIBER - Listening to queue: ${queueName}]`);
	}
	handledError(errorCode: string, message: any): void {
		console.log(`[HANDLED_ERROR - ${errorCode}] ${message}`);
	}
	logUseCase(useCase: string, message: any): void {
		console.log(`[USECASE - ${useCase}] ${message}`);
	}
	logEvent(eventName: string, message: any): void {
		console.log(`[EVENT - ${eventName}] ${message}`);
	}
	log(message: any): void {
		console.log(message);
	}
	error(message: any): void {
		console.error(message);
	}
}
