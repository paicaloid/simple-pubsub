import { MachineStorage } from './machine';
import { WarningOptional, noWarning, stockLevelOk } from './stockEvent';
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

	handle(event: MachineRefillEvent): WarningOptional {
		const machine = this.machines.getById(event.machineId())
		if (machine) {
			this.machines.increaseStock(machine, event.getSoldQuantity())

			/*
			Check if the stock level is above 3 and the machine needs a refill
			*/
			if ((machine.stockLevel > 3) && (machine.needRefill)) {
				return stockLevelOk(machine.id)
			}
			else {
				return noWarning(machine.id)
			}
		}

	}
}

export { MachineRefillEvent, MachineRefillSubscriber };
