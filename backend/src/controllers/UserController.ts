import express from 'express';
import User from '../models/User';

export const createUser = async (req: express.Request, res: express.Response) => {
  const createUserResult = await User.create(req.body);
  if (!createUserResult.success) {
    return res.status(createUserResult.error.status).send({ error: createUserResult.error });
  }
  return res.status(200).send({ user: createUserResult.user });
};
