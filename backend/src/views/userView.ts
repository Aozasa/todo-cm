import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const createUserTemplate = (userAttributes: CognitoIdentityServiceProvider.AttributeListType) => {
  const user = {
    username: userAttributes.find(attribute => attribute.Name == 'name')?.Value,
    id: userAttributes.find(attribute => attribute.Name == 'sub')?.Value,
    role: userAttributes.find(attribute => attribute.Name == 'custom:role')?.Value,
  };
  return { status: 200, user };
};
