import { WarningOptional } from "./stockEvent";

// interfaces
interface IEvent {
	type(): string;
	machineId(): string;
}

interface ISubscriber {
	// handle(event: IEvent): void;
	handle(event: IEvent): WarningOptional;
}

export { IEvent, ISubscriber };

