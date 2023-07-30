import { PrismaClient, Todos, Prisma } from '@prisma/client';
import z from 'zod';
import { IPrismaError, IZodError, prismaError } from '../types';

const prisma = new PrismaClient();

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

export default { create, list };
