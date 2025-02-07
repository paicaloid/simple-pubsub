import { MachineStorage, eventGenerator } from './machine';
import { MachineRefillEvent, MachineRefillSubscriber } from './refillEvent';
import { MachineSaleEvent, MachineSaleSubscriber } from './saleEvent';
import { StockWarningSubscriber, WarningOptional } from './stockEvent';
import { IEvent, ISubscriber } from './utils';


interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
  unsubscribe(type: string): void;
}

class PublishSubscribeService implements IPublishSubscribeService {
  private subscribers: { [key: string]: ISubscriber[] } = {};

  // add a subscriber to the list
  subscribe(type: string, handler: ISubscriber): void {
    if (this.subscribers[type] === undefined) {
      this.subscribers[type] = []
    }
    this.subscribers[type].push(handler)
  }

  publish(event: IEvent): void {
    const eventType = event.type();
    if (this.subscribers[eventType]) {
      this.subscribers[eventType].map(subscriber => {
        /*
        results is the warning that the subscriber returns
        - stockLevel < 3 and needRefill = false -> LowStockWarningEvent
        - stockLevel > 3 and needRefill = true -> StockLevelOkEvent
        - else -> NoWarningEvent
        */
        const result: WarningOptional = subscriber.handle(event)

        // if the subscriber returns a warning, publish it
        this.publish(result)
      });
    }
  }

  // remove a subscriber from the list
  unsubscribe(type: string): void {
    if (this.subscribers[type]) {
      this.subscribers[type].pop()
    }
  }

}

// for testing
const testSaleEvents: MachineSaleEvent[] = [
  new MachineSaleEvent(7, '001'),
  new MachineSaleEvent(1, '001'),
  new MachineSaleEvent(3, '001'),
];

// for testing
const testRefillEvents: MachineRefillEvent[] = [
  new MachineRefillEvent(2, '001'),
  new MachineRefillEvent(1, '001'),
  new MachineRefillEvent(2, '001'),
  new MachineRefillEvent(10, '001'),
];

// program
(async (n: number) => {
  // create 3 machines with a quantity of 10 stock (initMachine)
  const machines: MachineStorage = new MachineStorage()
  machines.initMachine()

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber = new MachineRefillSubscriber(machines);
  const warningSubscriber = new StockWarningSubscriber(machines);

  // create the PubSub service
  const pubSubService = new PublishSubscribeService();
  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber);
  pubSubService.subscribe('warning', warningSubscriber);

  // create n random events
  const events = Array.from({ length: n }, () => eventGenerator());

  // publish the events
  events.forEach(event => {
    console.log(event)
    pubSubService.publish(event)
  });
  console.log(machines.getAll())



})(70); // Pass the desired number of events here
