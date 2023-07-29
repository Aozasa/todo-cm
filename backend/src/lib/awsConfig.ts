import AWS from 'aws-sdk';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLINET_ID;
const clientSecret = process.env.COGNITO_CLINET_SECRET;

if (
  accessKeyId == null ||
  secretAccessKey == null ||
  region == null ||
  userPoolId == null ||
  clientId == null ||
  clientSecret == null
) {
  throw new Error('AWS Config is not configured.');
}
const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: 'id',
  clientId,
});
const cognitoClient = new AWS.CognitoIdentityServiceProvider({ accessKeyId, secretAccessKey, region });
const cognito = { userPoolId, clientId, clientSecret, client: cognitoClient, verifier };

export { cognito };
