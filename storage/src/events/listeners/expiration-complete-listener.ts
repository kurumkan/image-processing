import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ExpirationCompleteEvent } from "@kurumkanimgproc/common";
import { queueGroupName } from "./queue-group-name";
import { AwsClient } from "../../services/aws-client";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const {
            folder,
            fileName
        } = data;

        console.log('Received: ExpirationCompleteEvent', data);
        const client = AwsClient.getInstance();
        client.deleteObject(folder, fileName, (err, data) => {
           if (err) {
               console.log('Failed to delete image', err);
               return;
           }

           console.log('Image deleted', data);
           msg.ack();
        });
    }
}