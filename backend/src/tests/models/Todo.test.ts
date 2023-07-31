import Todo from '../../models/Todo';
import { prismaMock } from '../../../singleton';
import { Prisma } from '@prisma/client';

describe('create(Todo model)', () => {
  test('createが成功したらモデルを返す', async () => {
    const mockTodo = {
      title: 'title',
      description: 'description',
      isClosed: 'true',
      closedAt: new Date(),
      finishedAt: new Date(),
      priority: 'HIGH',
      username: 'username',
    };
    prismaMock.todos.create.mockResolvedValue(mockTodo as any);
    const answer = { success: true, res: mockTodo };
    const result = await Todo.create(mockTodo);
    expect(result).toEqual(answer);
  });

  test('createが失敗したらエラーレスポンスを返す(zod error)', async () => {
    const mockTodo = {
      title: 'a'.repeat(256),
      description: 'a'.repeat(2048),
      isClosed: true,
      closedAt: 'invalid date',
      finishedAt: 'invalid date',
      priority: 'HIGH',
      username: 1,
    };
    prismaMock.todos.create.mockResolvedValue(mockTodo as any);
    const answer = {
      success: false,
      errors: [
        {
          code: 'too_big',
          exact: false,
          inclusive: true,
          maximum: 255,
          message: 'String must contain at most 255 character(s)',
          path: ['title'],
          type: 'string',
        },
        {
          code: 'too_big',
          exact: false,
          inclusive: true,
          maximum: 2047,
          message: 'String must contain at most 2047 character(s)',
          path: ['description'],
          type: 'string',
        },
        {
          code: 'invalid_date',
          message: 'Invalid date',
          path: ['closedAt'],
        },
        {
          code: 'invalid_date',
          message: 'Invalid date',
          path: ['finishedAt'],
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Expected string, received number',
          path: ['username'],
          received: 'number',
        },
      ],
      type: 'zod',
    };
    const result = await Todo.create(mockTodo);
    expect(result).toEqual(answer);
  });

  test('createが失敗したらエラーレスポンスを返す(Prisma error)', async () => {
    const mockTodo = {
      title: 'title',
      description: 'description',
      isClosed: 'true',
      closedAt: new Date(),
      finishedAt: new Date(),
      priority: 'HIGH',
      username: 'username',
    };
    const answer = {
      success: false,
      error: new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' }),
      type: 'prisma',
    };
    prismaMock.todos.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' })
    );
    const result = await Todo.create(mockTodo);
    expect(result).toEqual(answer);
  });

  test('createが失敗したら例外を返す(unknown error)', async () => {
    const mockTodo = {
      title: 'title',
      description: 'description',
      isClosed: 'true',
      closedAt: new Date(),
      finishedAt: new Date(),
      priority: 'HIGH',
      username: 'username',
    };
    const error = { error: 'unexpected' };
    prismaMock.todos.create.mockRejectedValue(error);
    try {
      await Todo.create(mockTodo);
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});

describe('list(Todo model)', () => {
  test('listが成功したらモデルを返す', async () => {
    const mockTodo = {};
    prismaMock.todos.findMany.mockResolvedValue(mockTodo as any);
    const answer = { success: true, res: mockTodo };
    const result = await Todo.list(mockTodo);
    expect(result).toEqual(answer);
  });

  test('listが成功したらモデルを返す(ユーザ指定あり)', async () => {
    const mockTodo = {
      username: 'username',
    };
    prismaMock.todos.findMany.mockResolvedValue(mockTodo as any);
    const answer = { success: true, res: mockTodo };
    const result = await Todo.list(mockTodo);
    expect(result).toEqual(answer);
  });

  test('listが失敗したらエラーレスポンスを返す(zod error)', async () => {
    const mockTodo = {
      username: 1,
    };
    prismaMock.todos.findMany.mockResolvedValue(mockTodo as any);
    const answer = {
      success: false,
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Expected string, received number',
          path: ['username'],
          received: 'number',
        },
      ],
      type: 'zod',
    };
    const result = await Todo.list(mockTodo);
    expect(result).toEqual(answer);
  });

  test('listが失敗したらエラーレスポンスを返す(Prisma error)', async () => {
    const mockTodo = {
      username: 'username',
    };
    const answer = {
      success: false,
      error: new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' }),
      type: 'prisma',
    };
    prismaMock.todos.findMany.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' })
    );
    const result = await Todo.list(mockTodo);
    expect(result).toEqual(answer);
  });

  test('listが失敗したら例外を返す(unknown error)', async () => {
    const mockTodo = {
      username: 'username',
    };
    const error = { error: 'unexpected' };
    prismaMock.todos.findMany.mockRejectedValue(error);
    try {
      await Todo.list(mockTodo);
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});

describe('update(Todo model)', () => {
  test('updateが成功したらモデルを返す', async () => {
    const mockTodo = {
      data: {
        title: 'title',
        description: 'description',
        isClosed: 'true',
        closedAt: new Date(),
        finishedAt: new Date(),
        priority: 'HIGH',
        username: 'username',
      },
      where: { username: 'username', id: 1 },
    };
    prismaMock.todos.update.mockResolvedValue(mockTodo as any);
    const answer = { success: true, res: mockTodo };
    const result = await Todo.update(mockTodo);
    expect(result).toEqual(answer);
  });

  test('更新パラメータが無い場合、updateが成功する', async () => {
    const mockTodo = {
      data: {},
      where: { id: 1 },
    };
    prismaMock.todos.update.mockResolvedValue(mockTodo as any);
    const answer = { success: true, res: mockTodo };
    const result = await Todo.update(mockTodo);
    expect(result).toEqual(answer);
  });

  test('updateが失敗したらエラーレスポンスを返す(zod error)', async () => {
    const mockTodo = {
      data: {
        title: 'a'.repeat(256),
        description: 'a'.repeat(2048),
        isClosed: true,
        closedAt: 'invalid date',
        finishedAt: 'invalid date',
        priority: 'HIGH',
        username: 1,
      },
      where: { username: 1, id: 'invalid number' },
    };
    prismaMock.todos.update.mockResolvedValue(mockTodo as any);
    const answer = {
      success: false,
      errors: [
        {
          code: 'too_big',
          exact: false,
          inclusive: true,
          maximum: 255,
          message: 'String must contain at most 255 character(s)',
          path: ['data', 'title'],
          type: 'string',
        },
        {
          code: 'too_big',
          exact: false,
          inclusive: true,
          maximum: 2047,
          message: 'String must contain at most 2047 character(s)',
          path: ['data', 'description'],
          type: 'string',
        },
        {
          code: 'invalid_date',
          message: 'Invalid date',
          path: ['data', 'closedAt'],
        },
        {
          code: 'invalid_date',
          message: 'Invalid date',
          path: ['data', 'finishedAt'],
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Expected string, received number',
          path: ['data', 'username'],
          received: 'number',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Expected string, received number',
          path: ['where', 'username'],
          received: 'number',
        },
        {
          code: 'invalid_type',
          expected: 'number',
          message: 'Expected number, received nan',
          path: ['where', 'id'],
          received: 'nan',
        },
      ],
      type: 'zod',
    };
    const result = await Todo.update(mockTodo);
    expect(result).toEqual(answer);
  });

  test('updateが失敗したらエラーレスポンスを返す(Prisma error)', async () => {
    const mockTodo = {
      data: {
        title: 'title',
        description: 'description',
        isClosed: 'true',
        closedAt: new Date(),
        finishedAt: new Date(),
        priority: 'HIGH',
        username: 'username',
      },
      where: { username: 'username', id: 1 },
    };
    const answer = {
      success: false,
      error: new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' }),
      type: 'prisma',
    };
    prismaMock.todos.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' })
    );
    const result = await Todo.update(mockTodo);
    expect(result).toEqual(answer);
  });

  test('updateが失敗したら例外を返す(unknown error)', async () => {
    const mockTodo = {
      data: {
        title: 'title',
        description: 'description',
        isClosed: 'true',
        closedAt: new Date(),
        finishedAt: new Date(),
        priority: 'HIGH',
        username: 'username',
      },
      where: { username: 'username', id: 1 },
    };
    const error = { error: 'unexpected' };
    prismaMock.todos.update.mockRejectedValue(error);
    try {
      await Todo.update(mockTodo);
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});

describe('remove(Todo model)', () => {
  test('removeが成功したらモデルを返す', async () => {
    const mockTodo = {
      id: '1',
    };
    prismaMock.todos.delete.mockResolvedValue(mockTodo as any);
    const answer = { success: true, res: mockTodo };
    const result = await Todo.remove(mockTodo);
    expect(result).toEqual(answer);
  });

  test('removeが失敗したらエラーレスポンスを返す(zod error)', async () => {
    const mockTodo = {
      id: 'id',
    };
    prismaMock.todos.delete.mockResolvedValue(mockTodo as any);
    const answer = {
      success: false,
      errors: [
        {
          code: 'invalid_type',
          expected: 'number',
          message: 'Expected number, received nan',
          path: ['id'],
          received: 'nan',
        },
      ],
      type: 'zod',
    };
    const result = await Todo.remove(mockTodo);
    expect(result).toEqual(answer);
  });

  test('removeが失敗したらエラーレスポンスを返す(Prisma error)', async () => {
    const mockTodo = {
      id: 1,
    };
    const answer = {
      success: false,
      error: new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' }),
      type: 'prisma',
    };
    prismaMock.todos.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('error', { code: 'code', clientVersion: 'version' })
    );
    const result = await Todo.remove(mockTodo);
    expect(result).toEqual(answer);
  });

  test('removeが失敗したら例外を返す(unknown error)', async () => {
    const mockTodo = {
      id: 1,
    };
    const error = { error: 'unexpected' };
    prismaMock.todos.delete.mockRejectedValue(error);
    try {
      await Todo.remove(mockTodo);
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
