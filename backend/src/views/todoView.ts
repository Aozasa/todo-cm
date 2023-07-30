import { Todos } from '@prisma/client';

export const createTodoTemplate = (todo: Todos) => {
  return { status: 200, todo };
};

export const listTodoTemplate = (todos: Todos[]) => {
  return { status: 200, todos };
};

export const updateTodoTemplate = (todo: Todos) => {
  return { status: 200, todo };
};
