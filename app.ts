import { MachineStorage } from './machine';
import { MachineRefillSubscriber } from './refillEvent';
import { MachineSaleSubscriber } from './saleEvent';
import { IEvent, ISubscriber } from './utils';

interface IPublishSubscribeService {
  publish (event: IEvent): void;
  subscribe (type: string, handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
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

  // const exampleSaleEvent = new MachineSaleEvent(1, '001');
  // const exampleRefillEvent = new MachineRefillEvent(3, '001');

  // console.log(exampleSaleEvent.machineId());
  // console.log(exampleSaleEvent.getSoldQuantity());
  // console.log(exampleSaleEvent.type());

  // console.log(machines);

  // create the PubSub service
  // const pubSubService: IPublishSubscribeService = null as unknown as IPublishSubscribeService; // implement and fix this

  // create 5 random events
  // const events = [1,2,3,4,5].map(i => eventGenerator());
  // console.log(events);


  // subscribe the sale subscriber to the sale event
  // publish the events
  // events.map(pubSubService.publish);
})();
