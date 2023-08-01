import { verifyMiddleware } from '../../controllers/applicationController';
import Session from '../../models/Session';
import { unauthorizedErrorTemplate } from '../../views/applicationView';

jest.mock('aws-jwt-verify');
describe('verifyMiddleware(application controller)', () => {
  test('verifyMiddlewareが成功したら次のメソッドを呼び出す', async () => {
    const mock = jest.spyOn(Session, 'verify');
    const response = {
      success: true,
      res: {
        sub: 'userId',
        'custom:role': 'admin',
        name: 'name',
      },
    };
    mock.mockResolvedValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: {} },
    };
    const req = {
      headers: { authorization: 'Bearer token' },
    };
    const next = jest.fn();
    const result = await verifyMiddleware(req as any, res as any, next as any);
    expect(res.locals.user).toEqual({ id: 'userId', role: 'admin', name: 'name' });
    expect(next).toHaveBeenCalled();
  });

  test('authorizationヘッダが無い場合、認証エラーを返す', async () => {
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: {} },
    };
    const req = {
      headers: {},
    };
    const next = jest.fn();
    const result = await verifyMiddleware(req as any, res as any, next as any);
    expect(result).toEqual(unauthorizedErrorTemplate());
    expect(res.status.mock.calls[0][0]).toBe(401);
  });

  test('authorizationヘッダが不正な値の場合、認証エラーを返す', async () => {
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: {} },
    };
    const req = {
      headers: { authorization: 'test  ' },
    };
    const next = jest.fn();
    const result = await verifyMiddleware(req as any, res as any, next as any);
    expect(result).toEqual(unauthorizedErrorTemplate());
    expect(res.status.mock.calls[0][0]).toBe(401);
  });

  test('verifyに失敗した場合、認証エラーを返す', async () => {
    const mock = jest.spyOn(Session, 'verify');
    const response = {
      success: false,
    };
    mock.mockResolvedValue(response as any);
    const res = {
      status: jest.fn((_: number) => {
        return {
          send: (res: any) => {
            return res;
          },
        };
      }),
      locals: { user: {} },
    };
    const req = {
      headers: { authorization: 'Bearer token' },
    };
    const next = jest.fn();
    const result = await verifyMiddleware(req as any, res as any, next as any);
    expect(result).toEqual(unauthorizedErrorTemplate());
    expect(res.status.mock.calls[0][0]).toBe(401);
  });
});
