import AWS from 'aws-sdk';
import { checkRequiredFields } from '../utils/utils';

/**
 * This is for sending email using AWS SES
 * For development: Currently we're sending with sandbox enviroment. So will need to
 * verify both sender and recipient addresses before sending.
 * For production: Follow this guide http://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
 */

export default (emailParams = {}) => new Promise((resolve, reject) => {
  const SES = new AWS.SES({
    region: 'us-east-1',
  });
  const requiredFields = ['recipient', 'subject_data', 'body_data', 'sender'];
  if (!checkRequiredFields(emailParams, requiredFields)) {
    return reject(new Error('Missing params'));
  }
  const {
    bcc_recipient = [],
    cc_recipient = [],
    recipient,
    subject_data,
    subject_charset = 'UTF-8',
    body_type = 'text',
    body_data,
    body_charset = 'UTF-8',
    sender,
    reply_to = [],
  } = emailParams;

  const params = {
    Destination: {
      BccAddresses: bcc_recipient,
      CcAddresses: cc_recipient,
      ToAddresses: recipient,
    },
    Message: {
      Body: {
        [body_type === 'text' ? 'Text' : 'Html']: {
          Data: body_data,
          Charset: body_charset,
        },
      },
      Subject: {
        Data: subject_data,
        Charset: subject_charset,
      },
    },
    Source: sender,
    ReplyToAddresses: reply_to,
  };
  SES.sendEmail(params, (err, data) => {
    if (err) {
      return reject(err);
    }
    resolve(data);
  });
});
