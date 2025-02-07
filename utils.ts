import { WarningOptional } from "./stockEvent";

// interfaces
interface IEvent {
	type(): string;
	machineId(): string;
}

interface ISubscriber {
	// handle(event: IEvent): void;
	/*
	Change from void to WarningOptional
	to allow the subscriber to return warnings
	*/
	handle(event: IEvent): WarningOptional;
}

export { IEvent, ISubscriber };

