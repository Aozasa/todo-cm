import Todo from '../../models/Todo';
import * as todoView from '../../views/todoView';
import * as applicationView from '../../views/applicationView';
import { createTodo, deleteTodo, updateTodo, listTodo } from '../../controllers/todoController';

jest.mock('aws-jwt-verify');

describe('createTodo(todo controller)', () => {
  test('createが成功したらデータを返す(adminユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(todoView, 'createTodoTemplate');
    const response = { status: 200, token: 'token' };
    viewMock.mockReturnValue(response as any);
    const req = {
      body: { username: 'username' },
    };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'admin' } },
    };
    const result = await createTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('createが成功したらデータを返す(一般ユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(todoView, 'createTodoTemplate');
    const response = { status: 200, token: 'token' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'general' } },
    };
    const result = await createTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('ログインユーザが取得できない場合認証エラーを返す', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(applicationView, 'unauthorizedErrorTemplate');
    const response = { status: 401, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: {},
    };
    const result = await createTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(401);
  });

  test('createがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockResolvedValue({
      success: false,
      errors: [{ error: 'error' }],
      type: 'zod',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'zodParseErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await createTodo({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('createがprismaエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockResolvedValue({
      success: false,
      error: { message: 'error', statusCode: 400 },
      type: 'aws',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'prismaErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await createTodo({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 400 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('createが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockRejectedValue({
      error: 'unexpected',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await createTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('createが成功してもデータが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'create');
    mock.mockReturnValue({
      success: true,
      res: null,
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await createTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});

describe('deleteTodo(todo controller)', () => {
  test('removeが成功したらデータを返す(adminユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockResolvedValue({
      success: true,
      res: {},
    } as any);
    const viewMock = jest.spyOn(todoView, 'deleteTodoTemplate');
    const response = { status: 200 };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'admin' } },
    };
    const result = await deleteTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(mock.mock.calls[0][0]).toEqual({ id: '1' });
  });

  test('removeが成功したらデータを返す(一般ユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockResolvedValue({
      success: true,
      res: {},
    } as any);
    const viewMock = jest.spyOn(todoView, 'deleteTodoTemplate');
    const response = { status: 200 };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'general' } },
    };
    const result = await deleteTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(mock.mock.calls[1][0]).toEqual({ id: '1', username: 'name' });
  });

  test('ログインユーザが取得できない場合認証エラーを返す', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(applicationView, 'unauthorizedErrorTemplate');
    const response = { status: 401, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: {},
    };
    const result = await deleteTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(401);
  });

  test('removeがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockResolvedValue({
      success: false,
      errors: [{ error: 'error' }],
      type: 'zod',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'zodParseErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await deleteTodo(req as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('removeがprismaエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockResolvedValue({
      success: false,
      error: { message: 'error', statusCode: 400 },
      type: 'aws',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'prismaErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await deleteTodo(req as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 400 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('removeが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockRejectedValue({
      error: 'unexpected',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await deleteTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('removeが成功してもデータが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'remove');
    mock.mockResolvedValue({
      success: true,
      res: null,
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'general' } },
    };
    const result = await deleteTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});

describe('listTodo(todo controller)', () => {
  test('listが成功したらデータを返す(adminユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockResolvedValue({
      success: true,
      res: {},
    } as any);
    const viewMock = jest.spyOn(todoView, 'listTodoTemplate');
    const response = { status: 200 };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'admin' } },
    };
    const result = await listTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(mock.mock.calls[0][0]).toEqual({});
  });

  test('listが成功したらデータを返す(一般ユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockResolvedValue({
      success: true,
      res: {},
    } as any);
    const viewMock = jest.spyOn(todoView, 'listTodoTemplate');
    const response = { status: 200 };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'general' } },
    };
    const result = await listTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(mock.mock.calls[1][0]).toEqual({ username: 'name' });
  });

  test('ログインユーザが取得できない場合認証エラーを返す', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(applicationView, 'unauthorizedErrorTemplate');
    const response = { status: 401, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: {},
    };
    const result = await listTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(401);
  });

  test('listがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockResolvedValue({
      success: false,
      errors: [{ error: 'error' }],
      type: 'zod',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'zodParseErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await listTodo(req as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('listがprismaエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockResolvedValue({
      success: false,
      error: { message: 'error', statusCode: 400 },
      type: 'aws',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'prismaErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await listTodo(req as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 400 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('listが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockRejectedValue({
      error: 'unexpected',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await listTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('listが成功してもデータが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'list');
    mock.mockResolvedValue({
      success: true,
      res: null,
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'admin' } },
    };
    const result = await listTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});

describe('updateTodo(todo controller)', () => {
  test('updateが成功したらデータを返す(adminユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(todoView, 'updateTodoTemplate');
    const response = { status: 200 };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'admin' } },
    };
    const result = await updateTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(mock.mock.calls[0][0]).toEqual({ where: { id: '1' }, data: { title: 'title' } });
  });

  test('updateが成功したらデータを返す(一般ユーザ)', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(todoView, 'updateTodoTemplate');
    const response = { status: 200 };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'general' } },
    };
    const result = await updateTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(mock.mock.calls[1][0]).toEqual({ where: { id: '1', username: 'name' }, data: { title: 'title' } });
  });

  test('ログインユーザが取得できない場合認証エラーを返す', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockResolvedValue({
      success: true,
      res: {
        todo: {},
      },
    } as any);
    const viewMock = jest.spyOn(applicationView, 'unauthorizedErrorTemplate');
    const response = { status: 401, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: {},
    };
    const result = await updateTodo({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(401);
  });

  test('updateがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockResolvedValue({
      success: false,
      errors: [{ error: 'error' }],
      type: 'zod',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'zodParseErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await updateTodo(req as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('updateがprismaエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockResolvedValue({
      success: false,
      error: { message: 'error', statusCode: 404 },
      type: 'aws',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'prismaErrorTemplate');
    const response = { status: 400, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await updateTodo(req as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 400 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('updateが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockRejectedValue({
      error: 'unexpected',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await updateTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('updateが成功してもデータが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockReturnValue({
      success: true,
      res: null,
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'role' } },
    };
    const result = await createTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('updateが成功してもデータが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Todo, 'update');
    mock.mockResolvedValue({
      success: true,
      res: null,
    } as any);
    const viewMock = jest.spyOn(applicationView, 'internalServerErrorTemplate');
    const response = { status: 500, error: 'error' };
    viewMock.mockReturnValue(response as any);
    const req = { params: { todoId: '1' }, body: { title: 'title' } };
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: { id: 'id', name: 'name', role: 'admin' } },
    };
    const result = await updateTodo(req as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});
