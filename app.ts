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
        const result: WarningOptional = subscriber.handle(event)
        this.publish(result)
      });
    }
  }

  unsubscribe(type: string): void {
    if (this.subscribers[type]) {
      this.subscribers[type].pop()
    }
  }

}


const testSaleEvents: MachineSaleEvent[] = [
  new MachineSaleEvent(7, '001'),
  new MachineSaleEvent(1, '001'),
  new MachineSaleEvent(3, '001'),
];

const testRefillEvents: MachineRefillEvent[] = [
  new MachineRefillEvent(2, '001'),
  new MachineRefillEvent(1, '001'),
  new MachineRefillEvent(2, '001'),
  new MachineRefillEvent(10, '001'),
];

// program
(async (n: number) => {
  // const machines: Machine[] = [ new Machine('001'), new Machine('002'), new Machine('003') ];
  // create 3 machines with a quantity of 10 stock
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

  // test LowStockWarningEvent

  // console.log(testWarningEvent)

  // testSaleEvents.forEach(event => {
  //   console.log(event)
  //   pubSubService.publish(event)
  // });

  // testRefillEvents.forEach(event => {
  //   console.log(event)
  //   pubSubService.publish(event)
  // });

  // console.log(machines.getAll())

  // create n random events
  const events = Array.from({ length: n }, () => eventGenerator());
  // console.log(events);

  // publish the events
  events.forEach(event => {
    console.log(event)
    pubSubService.publish(event)
  });
  console.log(machines.getAll())



})(70); // Pass the desired number of events here
