import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
};

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'jwt-secret';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  // clean up
  for(let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// @ts-ignore
global.signin = () => {
  // Build jwt payload { id, email }
  const payload = {
    // @ts-ignore
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'example@example.com'
  }

  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Convert session to JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return string - cookie with encoded data
  return [`express:sess=${base64}`];
};