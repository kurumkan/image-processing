import { app } from './app';

const PORT = 3000;

const start =  () => {
  console.log('starting storage service')

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

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};

start();

