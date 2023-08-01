import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Prisma } from '@prisma/client';
import z from 'zod';

export const awsError = z.object({
  message: z.string(),
  code: z.string(),
  statusCode: z.number(),
});

export const prismaError = z.object({
  message: z.string(),
  meta: z.object({ target: z.array(z.string()) }).nullish(),
});

export const currentUser = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
});

export interface IZodError {
  success: false;
  errors: z.ZodIssue[];
  type: 'zod';
}

export interface IPrismaError {
  success: false;
  error: Prisma.PrismaClientKnownRequestError;
  type: 'prisma';
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

export interface IRefreshToken {
  success: true;
  res: CognitoIdentityServiceProvider.AdminInitiateAuthResponse;
}
