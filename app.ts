import { MachineStorage, eventGenerator } from './machine';
import { MachineRefillSubscriber } from './refillEvent';
import { MachineSaleSubscriber } from './saleEvent';
import { IEvent, ISubscriber } from './utils';

interface IPublishSubscribeService {
  publish (event: IEvent): void;
  subscribe (type: string, handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
  unsubscribe (type: string): void;
}

class PublishSubscribeService implements IPublishSubscribeService {
  private subscribers: { [key: string]: ISubscriber[] } = {};

  subscribe (type: string, handler: ISubscriber): void {
    if (this.subscribers[type] === undefined){
      this.subscribers[type] = []
    }
    this.subscribers[type].push(handler)
  }

  publish (event: IEvent): void {
    const eventType = event.type();
    // console.log(event)
    // console.log(eventType)
    // console.log(this.subscribers)
    if (this.subscribers[eventType]) {
      this.subscribers[eventType].forEach(subscriber => subscriber.handle(event));
    }
  }

  unsubscribe (type: string): void {
    if (this.subscribers[type]){
      this.subscribers[type].pop()
    }
  }

}


// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  // const machines: Machine[] = [ new Machine('001'), new Machine('002'), new Machine('003') ];

  // console.log(machines);

  const machines: MachineStorage = new MachineStorage()
  machines.initMachine()

  /*
  const randEvent: MachineSaleEvent = new MachineSaleEvent(1, '001');
  const saleSubscriber = new MachineSaleSubscriber(machines);
  saleSubscriber.handle(randEvent)
  */

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber = new MachineRefillSubscriber(machines);

  const pubSubService = new PublishSubscribeService();
  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber);


  // const exampleSaleEvent = new MachineSaleEvent(1, '001');
  // const exampleRefillEvent = new MachineRefillEvent(3, '001');
  // pubSubService.publish(exampleSaleEvent)

  // console.log(exampleSaleEvent.machineId());
  // console.log(exampleSaleEvent.getSoldQuantity());
  // console.log(exampleSaleEvent.type());

  // console.log(machines);

  // create the PubSub service
  // const pubSubService: IPublishSubscribeService = null as unknown as IPublishSubscribeService; // implement and fix this

  // create 5 random events
  const events = [1,2,3,4,5].map(i => eventGenerator());
  console.log(events);


  // subscribe the sale subscriber to the sale event
  // publish the events
  events.forEach(event => pubSubService.publish(event));

  console.log(machines.getAll())

  pubSubService.unsubscribe('sale')

  events.forEach(event => pubSubService.publish(event));
  console.log(machines.getAll())


})();
