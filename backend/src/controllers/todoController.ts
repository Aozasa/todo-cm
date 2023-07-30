import express from 'express';
import Todo from '../models/Todo';
import {
  internalServerErrorTemplate,
  prismaErrorTemplate,
  unauthorizedErrorTemplate,
  zodParseErrorTemplate,
} from '../views/applicationView';
import { createTodoTemplate, listTodoTemplate, updateTodoTemplate } from '../views/todoView';
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

export const listTodo = async (req: express.Request, res: express.Response) => {
  try {
    const parsedCurrentUser = currentUser.safeParse(res.locals.user);
    if (!parsedCurrentUser.success) {
      return res.status(401).send(unauthorizedErrorTemplate());
    }
    let listTodoResult;
    if (parsedCurrentUser.data.role == 'admin') {
      listTodoResult = await Todo.list({});
    } else {
      listTodoResult = await Todo.list({ username: parsedCurrentUser.data.name });
    }
    if (!listTodoResult.success) {
      if (listTodoResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(listTodoResult.errors));
      } else {
        return res.status(400).send(prismaErrorTemplate(listTodoResult.error));
      }
    }
    if (listTodoResult.res != null) {
      return res.status(200).send(listTodoTemplate(listTodoResult.res));
    }
    return res.status(500).send(internalServerErrorTemplate());
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate());
  }
};

export const updateTodo = async (req: express.Request, res: express.Response) => {
  try {
    const parsedCurrentUser = currentUser.safeParse(res.locals.user);
    if (!parsedCurrentUser.success) {
      return res.status(401).send(unauthorizedErrorTemplate());
    }
    let updateTodoResult;
    if (parsedCurrentUser.data.role == 'admin') {
      updateTodoResult = await Todo.update({ where: { id: req.params.todoId }, data: req.body });
    } else {
      updateTodoResult = await Todo.update({
        where: { id: req.params.todoId, username: parsedCurrentUser.data.name },
        data: req.body,
      });
    }
    if (!updateTodoResult.success) {
      if (updateTodoResult.type == 'zod') {
        return res.status(400).send(zodParseErrorTemplate(updateTodoResult.errors));
      } else {
        return res.status(400).send(prismaErrorTemplate(updateTodoResult.error));
      }
    }
    if (updateTodoResult.res != null) {
      return res.status(200).send(updateTodoTemplate(updateTodoResult.res));
    }
    return res.status(500).send(internalServerErrorTemplate());
  } catch (error) {
    console.error(error);
    return res.status(500).send(internalServerErrorTemplate());
  }
};
