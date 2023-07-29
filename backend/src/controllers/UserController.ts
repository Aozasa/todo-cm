import express from 'express';
import User from '../models/User';
import { awsErrorTemplate, internalServerErrorTemplate, zodParseErrorTemplate } from '../views/commonView';
import { createUserTemplate } from '../views/userView';

export const createUser = async (req: express.Request, res: express.Response) => {
  try {
    const createUserResult = await User.create(req.body);
    if (!createUserResult.success) {
      if (createUserResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(createUserResult.errors));
      } else {
        return res.status(createUserResult.error.statusCode).send(awsErrorTemplate(createUserResult.error));
      }
    }
    if (createUserResult.res.User?.Attributes != null) {
      return res.status(200).send(createUserTemplate(createUserResult.res.User.Attributes));
    }
    return res.status(500).send(internalServerErrorTemplate);
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate);
  }
};
