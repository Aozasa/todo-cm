import express from 'express';
import Session from '../models/Session';
import { awsErrorTemplate, internalServerErrorTemplate, zodParseErrorTemplate } from '../views/applicationView';
import { createSessionTemplate, refreshTokenSessionTemplate } from '../views/sessionView';

export const createSession = async (req: express.Request, res: express.Response) => {
  try {
    const createSessionResult = await Session.login(req.body);
    if (!createSessionResult.success) {
      if (createSessionResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(createSessionResult.errors));
      } else {
        return res.status(createSessionResult.error.statusCode).send(awsErrorTemplate(createSessionResult.error));
      }
    }
    if (createSessionResult.res.AuthenticationResult != null) {
      return res.status(200).send(createSessionTemplate(createSessionResult.res.AuthenticationResult));
    }
    return res.status(500).send(internalServerErrorTemplate());
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate());
  }
};

export const deleteSession = async (req: express.Request, res: express.Response) => {
  try {
    const deleteSessionResult = await Session.logout(req.body);
    if (!deleteSessionResult.success) {
      if (deleteSessionResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(deleteSessionResult.errors));
      } else {
        return res.status(deleteSessionResult.error.statusCode).send(awsErrorTemplate(deleteSessionResult.error));
      }
    }
    return res.status(200).send({ status: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate());
  }
};

export const verifySession = async (_: express.Request, res: express.Response) => {
  return res.status(200).send({ status: 200 });
};

export const refreshTokenSession = async (req: express.Request, res: express.Response) => {
  try {
    const refreshTokenSessionResult = await Session.refreshToken(req.body);
    if (!refreshTokenSessionResult.success) {
      if (refreshTokenSessionResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(refreshTokenSessionResult.errors));
      } else {
        return res
          .status(refreshTokenSessionResult.error.statusCode)
          .send(awsErrorTemplate(refreshTokenSessionResult.error));
      }
    }
    if (refreshTokenSessionResult.res.AuthenticationResult != null) {
      return res.status(200).send(refreshTokenSessionTemplate(refreshTokenSessionResult.res.AuthenticationResult));
    }
    return res.status(500).send(internalServerErrorTemplate());
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate());
  }
};
