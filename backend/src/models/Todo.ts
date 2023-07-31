import { Todos, Prisma } from '@prisma/client';
import prisma from '../../client';
import z from 'zod';
import { IPrismaError, IZodError } from '../types';

const createTodoParam = z.object({
  title: z.string().nonempty().max(255),
  description: z.string().nonempty().max(2047),
  isClosed: z.preprocess(item => item == 'true', z.boolean()),
  closedAt: z.coerce.date().nullish(),
  finishedAt: z.coerce.date().nullish(),
  priority: z.union([z.literal('HIGH'), z.literal('MIDDLE'), z.literal('LOW')]).nullish(),
  username: z.string(),
});

const listTodoParam = z.object({
  username: z.string().nullish(),
});

const updateTodoParam = z.object({
  data: z.object({
    title: z.string().nonempty().max(255).optional(),
    description: z.string().nonempty().max(2047).optional(),
    isClosed: z.preprocess(item => item == 'true', z.boolean()).optional(),
    closedAt: z.coerce.date().nullish(),
    finishedAt: z.coerce.date().nullish(),
    priority: z.union([z.literal('HIGH'), z.literal('MIDDLE'), z.literal('LOW')]).optional(),
    username: z.string().optional(),
  }),
  where: z.object({
    username: z.string().optional(),
    id: z.coerce.number(),
  }),
});

const removeTodoParam = z.object({
  id: z.coerce.number(),
  username: z.string().optional(),
});

const create = async (params: any) => {
  // バリデーションチェック
  const parsedParams = createTodoParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  try {
    const todo = await prisma.todos.create({ data: { ...parsedParams.data } });
    const ret: { success: true; res: Todos } = { success: true, res: todo };
    return ret;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const ret: IPrismaError = {
        success: false,
        error: error,
        type: 'prisma',
      };
      return ret;
    }
    throw error;
  }
};

const list = async (params: any) => {
  // バリデーションチェック
  const parsedParams = listTodoParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  try {
    const where = parsedParams.data.username == null ? undefined : { username: parsedParams.data.username };
    const todos = await prisma.todos.findMany({ where });
    const ret: { success: true; res: Todos[] } = { success: true, res: todos };
    return ret;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const ret: IPrismaError = {
        success: false,
        error: error,
        type: 'prisma',
      };
      return ret;
    }
    throw error;
  }
};

const update = async (params: any) => {
  // バリデーションチェック
  const parsedParams = updateTodoParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  try {
    const todo = await prisma.todos.update({ where: parsedParams.data.where, data: parsedParams.data.data });
    const ret: { success: true; res: Todos } = { success: true, res: todo };
    return ret;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const ret: IPrismaError = {
        success: false,
        error: error,
        type: 'prisma',
      };
      return ret;
    }
    throw error;
  }
};

const remove = async (params: any) => {
  // バリデーションチェック
  const parsedParams = removeTodoParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  try {
    const todo = await prisma.todos.delete({ where: parsedParams.data });
    const ret: { success: true; res: Todos } = { success: true, res: todo };
    return ret;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const ret: IPrismaError = {
        success: false,
        error: error,
        type: 'prisma',
      };
      return ret;
    }
    throw error;
  }
};

export default { create, list, update, remove };
