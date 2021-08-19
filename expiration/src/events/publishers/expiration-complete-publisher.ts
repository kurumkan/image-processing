import { Publisher, Subjects, ExpirationCompleteEvent } from '@kurumkanimgproc/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
