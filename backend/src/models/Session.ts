import { cognito } from '../lib/awsConfig';
import crypto from 'crypto';
import z from 'zod';
import { IAWSError, ILogin, IRefreshToken, IZodError, awsError } from '../types';

const loginParam = z.object({
  username: z.string(),
  password: z.string(),
});

const logoutParam = z.object({
  username: z.string(),
});

const verifyParam = z.object({
  token: z.string(),
});

const refreshTokenParam = z.object({
  username: z.string(),
  refreshToken: z.string(),
});

const login = async (params: any) => {
  // バリデーションチェック
  const parsedParams = loginParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  const { username, password } = parsedParams.data;
  const { userPoolId, clientId, client, clientSecret } = cognito;

  try {
    // SECRET_HASHは、ユーザー名とクライアントIDを結合し、ハッシュ化したものを設定
    const params = {
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: crypto
          .createHmac('sha256', clientSecret)
          .update(username + clientId)
          .digest('base64'),
      },
    };
    const loginRes = await client.adminInitiateAuth(params).promise();

    const ret: ILogin = { success: true, res: loginRes };
    return ret;
  } catch (error) {
    console.error(error);
    const parsedError = awsError.safeParse(error);
    if (parsedError.success) {
      const ret: IAWSError = {
        success: false,
        error: parsedError.data,
        type: 'aws',
      };
      return ret;
    }
    throw error;
  }
};

const logout = async (params: any) => {
  // バリデーションチェック
  const parsedParams = logoutParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  const { username } = parsedParams.data;
  const { userPoolId, client } = cognito;

  try {
    await client
      .adminUserGlobalSignOut({
        UserPoolId: userPoolId,
        Username: username,
      })
      .promise();

    const ret: { success: true } = { success: true };
    return ret;
  } catch (error) {
    console.error(error);
    const parsedError = awsError.safeParse(error);
    if (parsedError.success) {
      const ret: IAWSError = {
        success: false,
        error: parsedError.data,
        type: 'aws',
      };
      return ret;
    }
    console.log('hogehoge');
    throw error;
  }
};

const verify = async (params: any) => {
  // バリデーションチェック
  const parsedParams = verifyParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }
  const { token } = parsedParams.data;
  const { verifier } = cognito;
  try {
    const res = await verifier.verify(token);
    const ret: { success: true; res: typeof res } = { success: true, res };
    return ret;
  } catch (err) {
    console.error(err);
    const ret: { success: false; error: { message: string } } = {
      success: false,
      error: { message: 'token is invalid' },
    };
    return ret;
  }
};

const refreshToken = async (params: any) => {
  // バリデーションチェック
  const parsedParams = refreshTokenParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
    };
    return ret;
  }

  const { refreshToken, username } = parsedParams.data;
  const { userPoolId, client, clientId, clientSecret } = cognito;

  try {
    const res = await client
      .adminInitiateAuth({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: crypto
            .createHmac('sha256', clientSecret)
            .update(username + clientId)
            .digest('base64'),
        },
      })
      .promise();

    const ret: IRefreshToken = { success: true, res };
    return ret;
  } catch (error) {
    console.error(error);
    const parsedError = awsError.safeParse(error);
    if (parsedError.success) {
      const ret: IAWSError = {
        success: false,
        error: parsedError.data,
        type: 'aws',
      };
      return ret;
    }
    throw error;
  }
};

export default { login, logout, verify, refreshToken };
