import Queue from 'bull';
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    folder: string,
    fileName: string
}

const expirationQueue = new Queue<Payload>('transformation:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async job => {
    console.log('Expiration:complete event with id', job.data);
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        folder: job.data.folder,
        fileName: job.data.fileName
    });
});

export { expirationQueue };