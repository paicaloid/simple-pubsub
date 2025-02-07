import { MachineStorage } from './machine';
import { IEvent, ISubscriber } from './utils';

// This is the optional type that will be returned by the subscriber
type WarningOptional = LowStockWarningEvent | StockLevelOkEvent | NoWarningEvent;

// This is the event that will be emitted when the stock level is low
class LowStockWarningEvent implements IEvent {
	constructor(private readonly _machineId: string) { }

	machineId(): string {
		return this._machineId;
	}

	type(): string {
		return 'warning'
	}

	msg(): string {
		return 'LOW'
	}
}

// This is the event that will be emitted when the stock level is ok
class StockLevelOkEvent implements IEvent {
	constructor(private readonly _machineId: string) { }

	machineId(): string {
		return this._machineId;
	}

	type(): string {
		return 'warning'
	}

	msg(): string {
		return 'OK'
	}
}

// This is the event that will be emitted when there is no warning
class NoWarningEvent implements IEvent {
	constructor(private readonly _machineId: string) { }

	machineId(): string {
		return this._machineId;
	}

	type(): string {
		return 'no warning'
	}
}

class StockWarningSubscriber implements ISubscriber {
	public machines: MachineStorage;

	constructor(machines: MachineStorage) {
		this.machines = machines;
	}

	/*
	This method will handle the events emitted by the machines
	based on the event type, it will enable or disable the refill
	*/
	handle(event: LowStockWarningEvent | StockLevelOkEvent): WarningOptional {
		const machine = this.machines.getById(event.machineId())
		if (event instanceof LowStockWarningEvent) {
			this.machines.enableRefill(machine)
			console.log('---------------------------------')
			console.log(`Low stock warning for machine ${machine.id}!`)
			this.machines.report()
			console.log('---------------------------------')
		}

		if (event instanceof StockLevelOkEvent) {
			this.machines.disableRefill(machine)
			console.log('---------------------------------')
			console.log(`Stock level ok for machine ${machine.id}!`)
			this.machines.report()
			console.log('---------------------------------')
		}

		return noWarning(event.machineId())
	}
}

const lowStockWarning = (id: string): WarningOptional => new LowStockWarningEvent(id)
const stockLevelOk = (id: string): WarningOptional => new StockLevelOkEvent(id)
const noWarning = (id: string): WarningOptional => new NoWarningEvent(id)

export {
	lowStockWarning, LowStockWarningEvent, noWarning, stockLevelOk, StockLevelOkEvent,
	StockWarningSubscriber, WarningOptional
};

