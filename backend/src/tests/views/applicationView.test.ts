import {
  internalServerErrorTemplate,
  unauthorizedErrorTemplate,
  prismaErrorTemplate,
  zodParseErrorTemplate,
  awsErrorTemplate,
} from '../../views/applicationView';

describe('Application view', () => {
  test('internalServerErrorTemplateが正しい値を返す', async () => {
    expect(internalServerErrorTemplate()).toEqual({ message: 'Internal server error.', status: 500 });
  });

  test('unauthorizedErrorTemplateが正しい値を返す', async () => {
    expect(unauthorizedErrorTemplate()).toEqual({ message: 'Unauthorized Error.', status: 401 });
  });

  test('zodParseErrorTemplateが正しい値を返す', async () => {
    expect(zodParseErrorTemplate([{ message: 'test', path: ['test'] }] as any)).toEqual({
      status: 400,
      errors: [{ message: 'test', path: ['test'] }],
    });
  });

  test('prismaErrorTemplateが正しい値を返す', async () => {
    expect(prismaErrorTemplate({ err: 'error' } as any)).toEqual({
      status: 400,
      errors: [
        {
          error: {
            err: 'error',
            message:
              'Please check Prisma error code list "https://www.prisma.io/docs/reference/api-reference/error-reference"',
          },
        },
      ],
    });
  });

  test('awsErrorTemplateが正しい値を返す', async () => {
    expect(awsErrorTemplate({ statusCode: 404, message: 'message' } as any)).toEqual({
      status: 404,
      errors: [{ message: 'message' }],
    });
  });
});
