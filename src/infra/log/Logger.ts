export interface Logger {
	log(message: string): void;
	logUseCase(useCase: string, message: any): void;
	logEvent(eventName: string, message: any): void;
	logSubscriber(subcriberName: string): void;
	error(message: any): void;
	handledError(errorCode: string, message: any): void;
}
