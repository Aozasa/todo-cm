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

export const refreshTokenSessionTemplate = (
  authenticationResult: CognitoIdentityServiceProvider.AuthenticationResultType
) => {
  return {
    status: 200,
    session: {
      token: authenticationResult.IdToken,
    },
  };
};

export const verifySessionTemplate = () => {
  return { status: 200 };
};

export const deleteSessionTemplate = () => {
  return { status: 200 };
};
