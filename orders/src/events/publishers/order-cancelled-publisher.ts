import { Publisher, OrderCancelledEvent, Subjects } from '@microstub/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
