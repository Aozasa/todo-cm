import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const createSessionTemplate = (
  authenticationResult: CognitoIdentityServiceProvider.AuthenticationResultType
) => {
  return {
    status: 200,
    session: {
      token: authenticationResult.IdToken,
      refreshToken: authenticationResult.RefreshToken,
    },
  };
};
