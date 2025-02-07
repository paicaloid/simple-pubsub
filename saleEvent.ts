import { MachineStorage } from './machine';
import { WarningOptional, lowStockWarning, noWarning } from './stockEvent';
import { IEvent, ISubscriber } from './utils';


// implementations
class MachineSaleEvent implements IEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) { }

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

  constructor(machines: MachineStorage) {
    this.machines = machines;
  }

  handle(event: MachineSaleEvent): WarningOptional {
    const machine = this.machines.getById(event.machineId())
    if (machine) {
      this.machines.decreaseStock(machine, event.getSoldQuantity())

      // Check LowStockWarningEvent
      if ((machine.stockLevel < 3) && (!machine.needRefill)) {
        return lowStockWarning(machine.id)
      }
      else {
        return noWarning(machine.id)
      }
    }
  }
}

export { MachineSaleEvent, MachineSaleSubscriber };
