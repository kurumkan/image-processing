import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TransformationCreatedEvent } from '@kurumkanimgproc/common';
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class TransformationCreatedListener extends Listener<TransformationCreatedEvent> {
    subject: Subjects.TransformationCreated = Subjects.TransformationCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TransformationCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log('Transformation created event received: ', data);
        console.log(`this job will be processed in ${delay} ms`);

        // adding a job to a queue
        await expirationQueue.add(
            {
                folder: data.folder,
                fileName: data.fileName
            },
            {
                delay
            }
        );

        // ack the message
        msg.ack();
    }
}