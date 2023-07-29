import { cognito } from '../lib/awsConfig';
import z from 'zod';
import { IAWSError, ICreateUser, IZodError, awsError } from '../types';

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

const create = async (params: any) => {
  // バリデーションチェック
  const parsedParams = createUserParam.safeParse(params);
  if (!parsedParams.success) {
    // そのまま返すとtrue,falseの型推論がうまくいかないため型情報を付与
    const ret: IZodError = {
      success: false,
      errors: parsedParams.error.errors,
      type: 'zod',
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

    const ret: ICreateUser = { success: true, res: userRes };
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

export default { create };
