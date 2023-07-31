import User from '../../models/User';
import * as userView from '../../views/userView';
import * as applicationView from '../../views/applicationView';
import { createUser } from '../../controllers/userController';

describe('createUser(User controller)', () => {
  test('createが成功したらトークンを返す', async () => {
    const mock = jest.spyOn(User, 'create');
    mock.mockResolvedValue({
      success: true,
      res: {
        User: { Attributes: [] },
      },
    } as any);
    const viewMock = jest.spyOn(userView, 'createUserTemplate');
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
    };
    const result = await createUser({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('createがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(User, 'create');
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
    };
    const result = await createUser({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('createがcognitoエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(User, 'create');
    mock.mockResolvedValue({
      success: false,
      error: { message: 'error', statusCode: 404 },
      type: 'aws',
    } as any);
    const viewMock = jest.spyOn(applicationView, 'awsErrorTemplate');
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
    };
    const result = await createUser({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 404 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(404);
  });

  test('createが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(User, 'create');
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
    };
    const result = await createUser({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('createが成功してもトークンが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(User, 'create');
    mock.mockReturnValue({
      success: true,
      res: {},
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
    };
    const result = await createUser({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});
