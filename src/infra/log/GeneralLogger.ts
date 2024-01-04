import { Logger } from "./Logger";

export class GeneralLogger implements Logger {
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
