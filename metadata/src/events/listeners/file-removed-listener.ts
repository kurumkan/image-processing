import { Message } from 'node-nats-streaming';
import { Listener, Subjects, FileRemovedEvent } from "@kurumkanimgproc/common";
import { Meta } from "../../models/meta";
import { queueGroupName } from "./queue-group-name";

export class FileRemovedListener extends Listener<FileRemovedEvent> {
    subject: Subjects.FileRemoved = Subjects.FileRemoved;
    queueGroupName = queueGroupName;

    async onMessage(data: FileRemovedEvent["data"], msg: Message) {
        const { fileName } = data;
        Meta.findOneAndDelete({ fileName }, {}, (err, doc) => {
            if (err) {
               console.log('Error deleting', err);
               return;
            }

            console.log('Deleted', doc);
            msg.ack();
        });
    }
}