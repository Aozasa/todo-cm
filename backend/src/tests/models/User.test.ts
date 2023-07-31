import { cognito } from '../../lib/awsConfig';
import User from '../../models/User';

describe('create(User model)', () => {
  const { client } = cognito;
  test('createが成功したらユーザ情報を返す', async () => {
    const mockCreate = jest.spyOn(client, 'adminCreateUser');
    mockCreate.mockReturnValue({
      promise: async () => {
        return { user: {} };
      },
    } as any);
    const mockPassword = jest.spyOn(client, 'adminSetUserPassword');
    mockPassword.mockReturnValue({
      promise: async () => {
        return;
      },
    } as any);
    const answer = { success: true, res: { user: {} } };
    const result = await User.create({ username: 'a'.repeat(128), password: 'p1'.repeat(128), role: 'admin' });
    expect(result).toEqual(answer);
  });

  test('createの引数がバリデーションエラーの時にエラーレスポンスを返す(zod error)', async () => {
    const errors = [
      {
        code: 'custom',
        message: 'username must be 1 to 128 characters',
        path: ['username'],
      },
      {
        code: 'custom',
        message: 'password must be 8 to 256 characters',
        path: ['password'],
      },
      {
        code: 'custom',
        message: 'password must contain both lower-case letters and numbers',
        path: ['password'],
      },
    ];
    const answer = { success: false, errors, type: 'zod' };
    const result = await User.create({ username: 'a'.repeat(129), password: 'p', role: 'general' });
    expect(result).toEqual(answer);
  });

  test('createが失敗したらエラーレスポンスを返す(AWS Cognito user create error)', async () => {
    const error = { code: 'error code', message: 'error', statusCode: 400 };
    const mockCreate = jest.spyOn(client, 'adminCreateUser');
    mockCreate.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    const answer = { success: false, error, type: 'aws' };
    const result = await User.create({ username: 'test', password: 'password1', role: 'admin' });
    expect(result).toEqual(answer);
  });

  test('createが失敗したらエラーレスポンスを返す(AWS Cognito set password error)', async () => {
    const error = { code: 'error code', message: 'error', statusCode: 400 };
    const mockCreate = jest.spyOn(client, 'adminSetUserPassword');
    mockCreate.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    const answer = { success: false, error, type: 'aws' };
    const result = await User.create({ username: 'test', password: 'password1', role: 'admin' });
    expect(result).toEqual(answer);
  });

  test('createが失敗したら例外を返す(unknown error)', async () => {
    const error = { unexpect: 'test' };
    const mockCreate = jest.spyOn(client, 'adminCreateUser');
    mockCreate.mockReturnValue({
      promise: async () => {
        throw error;
      },
    } as any);
    try {
      await User.create({ username: 'test', password: 'password1', role: 'admin' });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
