import { Publisher, OrderCreatedEvent, Subjects } from '@microstub/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
