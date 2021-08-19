import Queue from 'bull';
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    transformationId: string,
}

const expirationQueue = new Queue<Payload>('transformation:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async job => {
    console.log('I want to publish expiration:complete event with transformationId', job.data.transformationId);
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        transformationId: job.data.transformationId
    });
});

export { expirationQueue };