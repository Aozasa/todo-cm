import express from 'express';
import Session from '../models/Session';
import { awsErrorTemplate, internalServerErrorTemplate, zodParseErrorTemplate } from '../views/commonView';
import { createSessionTemplate } from '../views/sessionView';

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
    return res.status(500).send(internalServerErrorTemplate);
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate);
  }
};
