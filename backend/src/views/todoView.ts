import { Todos } from '@prisma/client';

export const createTodoTemplate = (todo: Todos) => {
  return { status: 200, todo };
};
