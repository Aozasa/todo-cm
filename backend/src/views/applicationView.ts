import { IAWSError, IPrismaError, IZodError } from '../types';

export const internalServerErrorTemplate = () => {
  return { error: { message: 'Internal server error.' }, status: 500 };
};

export const unauthorizedErrorTemplate = () => {
  return { error: { message: 'Unauthorized Error.' }, status: 401 };
};

export const zodParseErrorTemplate = (errors: IZodError['errors']) => {
  return {
    status: 400,
    errors: errors.map(err => {
      return { message: err.message, path: err.path };
    }),
  };
};

export const prismaErrorTemplate = (error: IPrismaError['error']) => {
  return {
    status: 400,
    errors: [
      {
        error: {
          ...error,
          message:
            'Please check Prisma error code list "https://www.prisma.io/docs/reference/api-reference/error-reference"',
        },
      },
    ],
  };
};

export const awsErrorTemplate = (error: IAWSError['error']) => {
  return {
    status: error.statusCode,
    errors: [{ message: error.message }],
  };
};
