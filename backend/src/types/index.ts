import { CognitoIdentityServiceProvider } from 'aws-sdk';
import z from 'zod';

export const awsError = z.object({
  message: z.string(),
  code: z.string(),
  statusCode: z.number(),
});

export interface IZodError {
  success: false;
  errors: z.ZodIssue[];
  type: 'zod';
}

export interface IAWSError {
  success: false;
  error: z.infer<typeof awsError>;
  type: 'aws';
}

export interface ICreateUser {
  success: true;
  res: CognitoIdentityServiceProvider.AdminCreateUserResponse;
}

export interface ILogin {
  success: true;
  res: CognitoIdentityServiceProvider.AdminInitiateAuthResponse;
}
