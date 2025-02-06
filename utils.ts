// interfaces
interface IEvent {
	type(): string;
	machineId(): string;
}

interface ISubscriber {
	handle(event: IEvent): void;
}

export { IEvent, ISubscriber };

