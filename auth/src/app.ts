import express from 'express';
// when in async event handler we throw an error - it will hang
// instead this will pass the error with next() function behind the scenes
import 'express-async-errors';
import { json } from 'body-parser';
// jwt will be passed via cookies
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@kurumkanimgproc/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

const app = express();
// We are runiing behind ingress nginx proxy
// express by default will not trust proxy.
app.set('trust proxy', true);  
app.use(json());
app.use(cookieSession({
  signed: false, // should not encrypt
  // secure: process.env.NODE_ENV != 'test' // must be over https
  secure: false // this is only for prod
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };