import User from '../../models/User';
import jsonResponse from '../../utils/jsonResponse';
import { generateToken } from '../../utils/jwtHelper';

export default (event, context, callback) => {
  try {
    const bodyParams = JSON.parse(event.body);
    const { email, password } = bodyParams;
    if (!email || !password) {
      return callback(null, jsonResponse.badRequest('Missing params'));
    }
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return callback(null, jsonResponse.badRequest('User not found'));
        }
        return [user, user.comparePassword(password)];
      })
      .spread((user, passwordMatched) => {
        if (!passwordMatched) {
          return callback(null, jsonResponse.badRequest('User not found'));
        }
        const tokenPayload = {
          data: user.toObject(),
        };
        callback(null, jsonResponse.success({
          token: generateToken(tokenPayload),
        }));
      })
      .catch(err => callback(null, jsonResponse.serverError(err.message)));
  } catch (err) {
    callback(null, jsonResponse.badRequest(err));
  }
};
