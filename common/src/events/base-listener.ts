import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    protected ackWait = 5 * 1000;

    protected client: Stan;

    constructor(client:Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable() // deliver all the messages(handy after restarting)
            .setManualAckMode(true) // receiver should send message to sender(ack)
            // if everything was received and
            // processed successfully,
            // otherwise sender will resend event
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName); // this name is like a "mark":
        // once service started - nats will save all events from that point with this label
        // after restart - nats will reemit these events to the service
        // but not everything - only marked with this label and not processed yet
        // with it we create a "durable subscription"
        // nats will store all the acknowledged events inside an internal storage
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName, // queue group - to prevent duplicate messages across group
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }
}
