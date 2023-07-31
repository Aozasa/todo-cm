import { rejects } from 'assert';
import { cognito } from '../../lib/awsConfig';
import Session from '../../models/Session';

describe('login(Session model)', () => {
  const { client } = cognito;
  test('loginが成功したらトークンを返す', async () => {
    const mock = jest.spyOn(client, 'adminInitiateAuth');
    mock.mockReturnValue({
      promise: async () => {
        return 'token';
      },
    } as any);
    const answer = { success: true, res: 'token' };
    const result = await Session.login({ username: 'test', password: 'password' });
    expect(result).toEqual(answer);
  });

  test('loginの引数がバリデーションエラーの時にエラーレスポンスを返す(zod error)', async () => {
    const errors = [
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['username'],
        received: 'number',
      },
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['password'],
        received: 'number',
      },
    ];
    const answer = { success: false, errors, type: 'zod' };
    const result = await Session.login({ username: 1, password: 2 });
    expect(result).toEqual(answer);
  });

  test('loginが失敗したらエラーレスポンスを返す(AWS Cognito error)', async () => {
    const error = { code: 'error code', message: 'error', statusCode: 400 };
    const mock = jest.spyOn(client, 'adminInitiateAuth');
    mock.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    const answer = { success: false, error, type: 'aws' };
    const result = await Session.login({ username: 'test', password: 'password' });
    expect(result).toEqual(answer);
  });

  test('loginが失敗したら例外を返す(unknown error)', async () => {
    const error = { unexpect: 'test' };
    const mock = jest.spyOn(client, 'adminInitiateAuth');
    mock.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    try {
      await Session.login({ username: 'test', password: 'password' });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});

describe('logout(Session model)', () => {
  const { client } = cognito;
  test('logoutが成功したら成功ステータスを返す', async () => {
    const mock = jest.spyOn(client, 'adminUserGlobalSignOut');
    mock.mockReturnValue({
      promise: async () => {
        return;
      },
    } as any);
    const answer = { success: true };
    const result = await Session.logout({ username: 'test' });
    expect(result).toEqual(answer);
  });

  test('logoutの引数がバリデーションエラーの時にエラーレスポンスを返す(zod error)', async () => {
    const errors = [
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['username'],
        received: 'number',
      },
    ];
    const answer = { success: false, errors, type: 'zod' };
    const result = await Session.logout({ username: 1 });
    expect(result).toEqual(answer);
  });

  test('logoutが失敗したらエラーレスポンスを返す(AWS Cognito error)', async () => {
    const error = { code: 'error code', message: 'error', statusCode: 400 };
    const mock = jest.spyOn(client, 'adminUserGlobalSignOut');
    mock.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    const answer = { success: false, error, type: 'aws' };
    const result = await Session.logout({ username: 'test' });
    expect(result).toEqual(answer);
  });

  test('logoutが失敗したら例外を返す(unknown error)', async () => {
    const error = { unexpect: 'test' };
    const mock = jest.spyOn(client, 'adminUserGlobalSignOut');
    mock.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    try {
      await Session.logout({ username: 'test' });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});

describe('verify(Session model)', () => {
  const { verifier } = cognito;
  test('verifyが成功したらユーザ情報を返す', async () => {
    const mock = jest.spyOn(verifier, 'verify');
    mock.mockResolvedValue({
      user: 'user',
    } as any);
    const answer = { success: true, res: { user: 'user' } };
    const result = await Session.verify({ token: 'token' });
    expect(result).toEqual(answer);
  });

  test('verifyの引数がバリデーションエラーの時にエラーレスポンスを返す(zod error)', async () => {
    const errors = [
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['token'],
        received: 'number',
      },
    ];
    const answer = { success: false, errors, type: 'zod' };
    const result = await Session.verify({ token: 1 });
    expect(result).toEqual(answer);
  });

  test('verifyが失敗したらエラーレスポンスを返す(verify error)', async () => {
    const mock = jest.spyOn(verifier, 'verify');
    mock.mockRejectedValue({
      error: 'error',
    } as any);
    const answer = { success: false, error: { message: 'token is invalid' } };
    const result = await Session.verify({ token: 'token' });
    expect(result).toEqual(answer);
  });
});

describe('refreshToken(Session model)', () => {
  const { client } = cognito;
  test('refreshTokenが成功したらトークンを返す', async () => {
    const mock = jest.spyOn(client, 'adminInitiateAuth');
    mock.mockReturnValue({
      promise: async () => {
        return 'token';
      },
    } as any);
    const answer = { success: true, res: 'token' };
    const result = await Session.refreshToken({ username: 'test', refreshToken: 'refreshToken' });
    expect(result).toEqual(answer);
  });

  test('refreshTokenの引数がバリデーションエラーの時にエラーレスポンスを返す(zod error)', async () => {
    const errors = [
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['username'],
        received: 'number',
      },
      {
        code: 'invalid_type',
        expected: 'string',
        message: 'Expected string, received number',
        path: ['refreshToken'],
        received: 'number',
      },
    ];
    const answer = { success: false, errors, type: 'zod' };
    const result = await Session.refreshToken({ username: 1, refreshToken: 2 });
    expect(result).toEqual(answer);
  });

  test('refreshTokenが失敗したらエラーレスポンスを返す(AWS Cognito error)', async () => {
    const error = { code: 'error code', message: 'error', statusCode: 400 };
    const mock = jest.spyOn(client, 'adminInitiateAuth');
    mock.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    const answer = { success: false, error, type: 'aws' };
    const result = await Session.refreshToken({ username: 'test', refreshToken: 'refreshToken' });
    expect(result).toEqual(answer);
  });

  test('refreshTokenが失敗したら例外を返す(unknown error)', async () => {
    const error = { unexpect: 'test' };
    const mock = jest.spyOn(client, 'adminInitiateAuth');
    mock.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    try {
      await Session.refreshToken({ username: 'test', refreshToken: 'refreshToken' });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
