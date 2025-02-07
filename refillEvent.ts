import { MachineStorage } from './machine';
import { IEvent, ISubscriber } from './utils';

class MachineRefillEvent implements IEvent {
	constructor(private readonly _refill: number, private readonly _machineId: string) { }

	machineId(): string {
		return this._machineId;
	}

	getSoldQuantity(): number {
		return this._refill
	}

	type(): string {
		return 'refill';
	}
}



class MachineRefillSubscriber implements ISubscriber {
	public machines: MachineStorage;

	constructor(machines: MachineStorage) {
		this.machines = machines;
	}

	handle(event: MachineRefillEvent): void {
		const machine = this.machines.getById(event.machineId())
		if (machine) {
			this.machines.adjustStock(machine, event.getSoldQuantity())
		}
		// this.machines[2].stockLevel += event.getSoldQuantity();
	}
}

export { MachineRefillEvent, MachineRefillSubscriber };
