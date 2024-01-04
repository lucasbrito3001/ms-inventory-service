export interface Logger {
	log(message: any): void;
	logEvent(eventName: string, message: any): void;
	error(message: any): void;
}
