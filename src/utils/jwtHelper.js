import JWT from 'jsonwebtoken';

export const generateToken = (payload = {}, options = {}) => {
  const tokenOptions = Object.assign({
    expiresIn: '30d',
  }, options);
  const token = JWT.sign(payload, process.env.SECRET_KEY, tokenOptions);
  return token;
};

export const verifyToken = (token, options = {}) => new Promise((resolve, reject) => {
  if (!token) reject(new Error('Missing token'));
  JWT.verify(token, process.env.SECRET_KEY, options, (err, decoded) => {
    if (err) return reject(err);
    return resolve(decoded);
  });
});
