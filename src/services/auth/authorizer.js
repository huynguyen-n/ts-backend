import { verifyToken } from '../../utils/jwtHelper';

const generatePolicy = (principalId, effect, resource, authToken = null) => {
  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
    authResponse.context = {
      stringKey: authToken,
    };
  }
  return authResponse;
};

/**
 * Possible responses for custom authorizer
 * 'Allow' policy continues to process --> Success
 * 'Deny' policy returns 403 Forbidden response --> Invalid JWT
 * 'Unauthorized' returns 401 Unauthorized response --> Expired JWT
 * Other errors return 500 Internal Server Error response --> Others
 */
export default (event, context, callback) => {
  if (!event.authorizationToken || !event.methodArn) {
    return callback('Unauthorized');
  }
  verifyToken(event.authorizationToken)
    .then((payload) => {
      const principalId = payload.data && payload.data.email ? payload.data.email : 'user';
      callback(null, generatePolicy(principalId, 'Allow', event.methodArn, event.authorizationToken));
    })
    .catch((err) => {
      if (err.name === 'TokenExpiredError') {
        callback('Unauthorized');
      } else {
        callback(null, generatePolicy('user', 'Deny', event.methodArn, event.authorizationToken));
      }
    });
};
