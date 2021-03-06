import { app } from './app';
import { natsWrapper } from "./nats-wrapper";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

const PORT = 3000;

const start =  async () => {
  console.log('Starting storage service');

  if(!process.env.SPACES_URL) {
    throw new Error("SPACES_URL must be defined");
  }
  if(!process.env.SPACES_BUCKET) {
    throw new Error("SPACES_BUCKET must be defined");
  }
  if(!process.env.SPACES_KEY) {
    throw new Error("SPACES_KEY must be defined");
  }
  if(!process.env.SPACES_SECRET) {
    throw new Error("SPACES_SECRET must be defined");
  }

  if(!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if(!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  if(!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ExpirationCompleteListener(natsWrapper.client).listen();
  } catch(err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};

start();

