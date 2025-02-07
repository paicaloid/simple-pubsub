import { MachineStorage } from './machine';
import { IEvent, ISubscriber } from './utils';

type WarningOptional = LowStockWarningEvent | StockLevelOkEvent | NoWarningEvent;

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

