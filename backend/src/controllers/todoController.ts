import express from 'express';
import Todo from '../models/Todo';
import {
  internalServerErrorTemplate,
  prismaErrorTemplate,
  unauthorizedErrorTemplate,
  zodParseErrorTemplate,
} from '../views/applicationView';
import { createTodoTemplate } from '../views/todoView';
import { currentUser } from '../types';

export const createTodo = async (req: express.Request, res: express.Response) => {
  try {
    const parsedCurrentUser = currentUser.safeParse(res.locals.user);
    if (!parsedCurrentUser.success) {
      return res.status(401).send(unauthorizedErrorTemplate());
    }
    const createTodoResult = await Todo.create({ ...req.body, username: parsedCurrentUser.data.name });
    if (!createTodoResult.success) {
      if (createTodoResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(createTodoResult.errors));
      } else {
        return res.status(400).send(prismaErrorTemplate(createTodoResult.error));
      }
    }
    if (createTodoResult.res != null) {
      return res.status(200).send(createTodoTemplate(createTodoResult.res));
    }
    return res.status(500).send(internalServerErrorTemplate());
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate());
  }
};
