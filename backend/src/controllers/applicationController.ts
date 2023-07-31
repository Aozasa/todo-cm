import express from 'express';
import Session from '../models/Session';
import { unauthorizedErrorTemplate } from '../views/applicationView';

export const verifyMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization != null) {
    const regToken = authorization.match(/Bearer\s+(\S+)/);
    if (regToken != null && regToken[1] != null) {
      const verifyRes = await Session.verify({ token: regToken[1] });
      if (verifyRes.success) {
        const tokenInfo = verifyRes.res;
        res.locals.user = { id: tokenInfo.sub, role: tokenInfo['custom:role'], name: tokenInfo.name };
        return next();
      }
    }
  }
  return res.status(401).send(unauthorizedErrorTemplate());
};
