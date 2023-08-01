import {
  createSessionTemplate,
  refreshTokenSessionTemplate,
  deleteSessionTemplate,
  verifySessionTemplate,
} from '../../views/sessionView';

describe('Session view', () => {
  test('createSessionTemplateが正しい値を返す', async () => {
    expect(createSessionTemplate({ IdToken: 'IdToken', RefreshToken: 'RefreshToken' })).toEqual({
      status: 200,
      session: { token: 'IdToken', refreshToken: 'RefreshToken' },
    });
  });

  test('refreshTokenSessionTemplateが正しい値を返す', async () => {
    expect(refreshTokenSessionTemplate({ IdToken: 'IdToken' })).toEqual({ status: 200, session: { token: 'IdToken' } });
  });

  test('verifySessionTemplateが正しい値を返す', async () => {
    expect(verifySessionTemplate()).toEqual({ status: 200 });
  });

  test('deleteSessionTemplateが正しい値を返す', async () => {
    expect(deleteSessionTemplate()).toEqual({ status: 200 });
  });
});
