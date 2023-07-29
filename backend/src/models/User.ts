import { cognito } from '../lib/awsConfig';
import z from 'zod';

const createUserParam = z.object({
  username: z.string().refine(val => val.length > 1 && val.length < 128, {
    message: 'username must be 1 to 128 characters',
  }),
  password: z
    .string()
    .refine(val => val.length > 7 && val.length < 257, {
      message: 'password must be 8 to 256 characters',
    })
    .refine(val => val.match(/^(?=.*[0-9])(?=.*[a-z])*/) != null, {
      message: 'password must contain both lower-case letters and numbers',
    }),
  role: z.union([z.literal('admin'), z.literal('general')]),
});

interface IError {
  success: false;
  error: {
    status: number;
    message: string;
  };
}

interface ICreate {
  success: true;
  user: {
    username?: string;
    id?: string;
    role?: string;
  };
}

const awsError = z.object({
  message: z.string(),
  code: z.string(),
  statusCode: z.number(),
});

const create = async (params: any) => {
  // バリデーションチェック
  const parsedParams = createUserParam.safeParse(params);
  if (!parsedParams.success) {
    console.error(parsedParams.error.errors);
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IError = {
      success: false,
      error: { message: parsedParams.error.errors.map(error => error.message).join(), status: 400 },
    };
    return ret;
  }

  const { username, password, role } = parsedParams.data;
  const { userPoolId } = cognito;

  try {
    // Cognitoユーザの作成
    const userRes = await cognito.client
      .adminCreateUser({
        UserPoolId: userPoolId,
        Username: username,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          {
            Name: 'name',
            Value: username,
          },
          {
            Name: 'custom:role',
            Value: role,
          },
        ],
      })
      .promise();

    // Cognitoユーザのパスワードの設定
    await cognito.client
      .adminSetUserPassword({
        UserPoolId: userPoolId,
        Username: username,
        Password: password,
        Permanent: true,
      })
      .promise();

    if (userRes.User?.Attributes != null) {
      const user = {
        username: userRes.User?.Attributes.find(attribute => attribute.Name == 'name')?.Value,
        id: userRes.User?.Attributes.find(attribute => attribute.Name == 'sub')?.Value,
        role: userRes.User?.Attributes.find(attribute => attribute.Name == 'custom:role')?.Value,
      };
      const ret: ICreate = { success: true, user };
      return ret;
    }
    const ret: IError = { success: false, error: { message: 'Internal server error.', status: 500 } };
    return ret;
  } catch (error) {
    const parsedError = awsError.safeParse(error);
    let ret: IError = { success: false, error: { message: 'Internal server error.', status: 500 } };
    if (parsedError.success) {
      ret = { success: false, error: { message: parsedError.data.message, status: parsedError.data.statusCode } };
    }
    return ret;
  }
};

export default { create };
