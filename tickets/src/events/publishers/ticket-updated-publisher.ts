import { Publisher, Subjects, TicketUpdatedEvent } from '@microstub/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
