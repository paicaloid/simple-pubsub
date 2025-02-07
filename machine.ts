import { MachineRefillEvent } from './refillEvent';
import { MachineSaleEvent } from './saleEvent';
import { IEvent } from './utils';

// objects
class Machine {
	public stockLevel = 10;
	public needRefill: boolean = false;
	public id: string;

	constructor(id: string) {
		this.id = id;
	}
}


class MachineStorage {
	private machine: Machine[] = [];

	initMachine(): void {
		this.machine.push(new Machine('001'))
		this.machine.push(new Machine('002'))
		this.machine.push(new Machine('003'))
	}

	report(): void {
		this.machine.forEach(m => {
			console.log(`Machine ${m.id} has stock level ${m.stockLevel} and ${m.needRefill ? 'needs refill' : 'does not need refill'}`)
		})
	}

	getAll(): Machine[] {
		return this.machine
	}

	getById(id: string): Machine | undefined {
		return this.machine.find(machine => machine.id === id)
	}

	// prevent stockLevel less than zero
	decreaseStock(machine: Machine, quantity: number): void {
		if (machine) {
			machine.stockLevel = Math.max(machine.stockLevel - quantity, 0);
		}
	}

	// prevent stockLevel more than ??
	increaseStock(machine: Machine, quantity: number): void {
		if (machine) {
			machine.stockLevel += quantity;
		}
	}

	enableRefill(machine: Machine): void {
		machine.needRefill = true;
	}

	disableRefill(machine: Machine): void {
		machine.needRefill = false;
	}
}

// helpers
const randomMachine = (): string => {
	const random = Math.random() * 3;
	if (random < 1) {
		return '001';
	} else if (random < 2) {
		return '002';
	}
	return '003';

}

const eventGenerator = (): IEvent => {
	const random = Math.random();
	if (random < 0.8) {
		const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
		return new MachineSaleEvent(saleQty, randomMachine());
	}
	const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
	return new MachineRefillEvent(refillQty, randomMachine());
}

const stockWarningGenerator = (machines: MachineStorage): void => {
	const machine = machines.getAll()
	machine.forEach(m => console.log(m))
}


export { eventGenerator, Machine, MachineStorage, randomMachine, stockWarningGenerator };

