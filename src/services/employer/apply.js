import { checkRequiredFields } from '../../utils/utils';
import jsonResponse from '../../utils/jsonResponse';
import ApplyForm from '../../models/ApplyForm';

export default (event, context, callback) => {
  try {
    const bodyParams = JSON.parse(event.body);
    const requiredParams = ['email', 'company_name', 'full_name'];
    if (!checkRequiredFields(bodyParams, requiredParams)) {
      return callback(null, jsonResponse.badRequest('Missing params'));
    }
    const {
      email,
      company_name,
      full_name,
      skype_id,
      phone_number,
    } = bodyParams;

    ApplyForm.create({
      role: 'employer',
      email,
      company_name,
      full_name,
      skype_id,
      phone_number,
    })
      // TODO: Send email to user for verification
      .then(() => callback(null, jsonResponse.success({ status: 'success' })))
      .catch(err => callback(null, jsonResponse.serverError(err.message)));
  } catch (err) {
    callback(null, jsonResponse.badRequest(err));
  }
};
