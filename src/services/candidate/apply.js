import { checkRequiredFields } from '../../utils/utils';
import jsonResponse from '../../utils/jsonResponse';
import User from '../../models/User';
import ApplyForm from '../../models/ApplyForm';

// TODO: Handle candidate upload CV
export default (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const bodyParams = JSON.parse(event.body);
    const requiredParams = ['email', 'password', 'full_name', 'skype_id', 'skills'];
    if (!checkRequiredFields(bodyParams, requiredParams)) {
      return callback(null, jsonResponse.badRequest('Missing params'));
    }
    const {
      email,
      password,
      full_name,
      skype_id,
      skills,
    } = bodyParams;

    User
      .checkEmailExisted(email)
      .then((emailExisted) => {
        if (emailExisted) {
          return callback(null, jsonResponse.badRequest('Email already existed'));
        }
        return User.create({
          email,
          password,
          role: 'candidate',
        });
      })
      .then(user => ApplyForm.create({
        user_id: user._id,
        role: 'candidate',
        email,
        full_name,
        skype_id,
        skills,
      }))
      // TODO: Send email to user for verification
      .then(() => callback(null, jsonResponse.success({ status: 'success' })))
      .catch(err => callback(null, jsonResponse.serverError(err.message)));
  } catch (err) {
    callback(null, jsonResponse.badRequest(err));
  }
};
