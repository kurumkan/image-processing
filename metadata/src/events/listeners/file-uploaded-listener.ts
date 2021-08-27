import { Message } from 'node-nats-streaming';
import { Listener, Subjects, FileUploadedEvent } from "@kurumkanimgproc/common";
import { Meta } from "../../models/meta";
import { queueGroupName } from "./queue-group-name";

export class FileUploadedListener extends Listener<FileUploadedEvent> {
    // it will work as final - unchangable in the future
    subject: Subjects.FileUploaded = Subjects.FileUploaded;
    // when we have multiple instances of meta service
    // they will be in the same queue group
    // this will make sure that only single instance will receive a message
    queueGroupName = queueGroupName;

    async onMessage(data: FileUploadedEvent["data"], msg: Message) {
        const { userId, url, fileName } = data;
        const meta = Meta.build({
            userId, url, fileName, alt : '', lowsrc: '', title: ''
        });
        await meta.save();
        
        console.log('FileUploaded received', url);

        // ack that message recieved so nats won't resend it
        msg.ack();
    }
}