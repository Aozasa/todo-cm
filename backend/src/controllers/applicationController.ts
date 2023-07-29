import express from 'express';
import Session from '../models/Session';
import { unauthorizedErrorTemplate } from '../views/applicationView';

export const verifyMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization != null) {
    const res = await Session.verify({ token: authorization.split(' ')[1] });
    if (res.success) {
      return next();
    }
  }
  return res.status(401).send(unauthorizedErrorTemplate());
};
