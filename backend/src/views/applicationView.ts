import { IAWSError, IZodError } from '../types';

export const internalServerErrorTemplate = () => {
  return { message: 'Internal server error.', status: 500 };
};

export const unauthorizedErrorTemplate = () => {
  return { message: 'Unauthorized Error.', status: 401 };
};

export const zodParseErrorTemplate = (errors: IZodError['errors']) => {
  return {
    status: 400,
    errors: errors.map(err => {
      return { message: err.message, path: err.path };
    }),
  };
};

export const awsErrorTemplate = (error: IAWSError['error']) => {
  return {
    status: error.statusCode,
    errors: [{ message: error.message }],
  };
};
