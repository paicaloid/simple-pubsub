import { MachineStorage } from './machine';
import { IEvent, ISubscriber } from './utils';


// implementations
class MachineSaleEvent implements IEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold
  }

  type(): string {
    return 'sale';
  }
}

class MachineSaleSubscriber implements ISubscriber {
  public machines: MachineStorage;

  constructor (machines: MachineStorage) {
    this.machines = machines;
  }

  handle(event: MachineSaleEvent): void {
    const machine = this.machines.getById(event.machineId())
    if (machine) {
      this.machines.adjustStock(machine, event.getSoldQuantity())
    }
  }
}

export { MachineSaleEvent, MachineSaleSubscriber };
