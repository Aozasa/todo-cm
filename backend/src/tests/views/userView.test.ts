import { createUserTemplate } from '../../views/userView';

describe('User view', () => {
  const mockUser = [
    { Name: 'name', Value: 'name' },
    { Name: 'sub', Value: 'id' },
    { Name: 'custom:role', Value: 'role' },
  ];
  test('createUserTemplateが正しい値を返す', async () => {
    expect(createUserTemplate(mockUser)).toEqual({
      status: 200,
      user: { username: 'name', id: 'id', role: 'role' },
    });
  });
});
