import Session from '../../models/Session';
import * as sessionView from '../../views/sessionView';
import * as applicationView from '../../views/applicationView';
import { createSession, deleteSession, refreshTokenSession, verifySession } from '../../controllers/sessionController';

describe('createSession(Session controller)', () => {
  test('loginが成功したらトークンを返す', async () => {
    const mock = jest.spyOn(Session, 'login');
    mock.mockResolvedValue({
      success: true,
      res: {
        AuthenticationResult: {},
      },
    } as any);
    const viewMock = jest.spyOn(sessionView, 'createSessionTemplate');
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
    const result = await createSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('loginがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'login');
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
    const result = await createSession({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('loginがcognitoエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'login');
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
    const result = await createSession({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 404 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(404);
  });

  test('loginが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'login');
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
    const result = await createSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('loginが成功してもトークンが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'login');
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
    const result = await createSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});

describe('deleteSession(Session controller)', () => {
  test('logoutが成功したらトークンを返す', async () => {
    const mock = jest.spyOn(Session, 'logout');
    mock.mockResolvedValue({
      success: true,
      res: {},
    } as any);
    const viewMock = jest.spyOn(sessionView, 'deleteSessionTemplate');
    const response = { status: 200 };
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
    const result = await deleteSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('logoutがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'logout');
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
    const result = await deleteSession({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('logoutがcognitoエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'logout');
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
    const result = await deleteSession({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 404 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(404);
  });

  test('logoutが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'logout');
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
    const result = await deleteSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});

describe('verifySession(Session controller)', () => {
  test('refreshTokenが成功したら成功ステータスを返す', async () => {
    const viewMock = jest.spyOn(sessionView, 'verifySessionTemplate');
    const response = {};
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
    const result = await verifySession({} as any, res as any);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });
});

describe('refreshTokenSession(Session controller)', () => {
  test('refreshTokenが成功したらトークンを返す', async () => {
    const mock = jest.spyOn(Session, 'refreshToken');
    mock.mockResolvedValue({
      success: true,
      res: {
        AuthenticationResult: {},
      },
    } as any);
    const viewMock = jest.spyOn(sessionView, 'refreshTokenSessionTemplate');
    const response = { status: 200 };
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
    const result = await refreshTokenSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(200);
  });

  test('refreshTokenがバリデーションで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'refreshToken');
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
    const result = await refreshTokenSession({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual([{ error: 'error' }]);
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  test('refreshTokenがcognitoエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'refreshToken');
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
    const result = await refreshTokenSession({} as any, res as any);

    expect(viewMock.mock.calls[0][0]).toEqual({ message: 'error', statusCode: 404 });
    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(404);
  });

  test('refreshTokenが予期せぬエラーで失敗したらエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'refreshToken');
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
    const result = await refreshTokenSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });

  test('refreshTokenが成功してもトークンが取れない場合にエラーレスポンス返す', async () => {
    const mock = jest.spyOn(Session, 'refreshToken');
    mock.mockReturnValue({
      success: true,
      res: { AuthenticationResult: null },
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
    const result = await refreshTokenSession({} as any, res as any);

    expect(result).toEqual(response);
    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});
