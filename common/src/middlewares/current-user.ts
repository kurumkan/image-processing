import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string,
  email: string
}

// adding additional property to an existing interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('currentUser: session', req.session?.jwt);
  if(!req.session?.jwt) {
    console.log('currentUser: next');
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    console.log('currentUser: success', payload)
    req.currentUser = payload;
  } catch(err) {
    console.log('currentUser: error', err)
  }

  next();
}