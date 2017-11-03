const response = (body = {}, headers = {}, statusCode = 200) => (
  {
    statusCode,
    headers: Object.assign({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }, headers),
    body: typeof body === 'string' ?
      JSON.stringify({ message: body }) :
      JSON.stringify(body),
  }
);

const errorResponse = (error = {}, headers = {}, status = 500) => {
  const message = typeof error === 'string' ? error : error.message;
  console.log('An error response has been sent: ', error);

  return response({
    status,
    detail: message,
  }, headers, status);
};

module.exports = {
  success: (body, headers) => response(body, headers, 200),
  serverError: (body, headers) => errorResponse(body, headers, 500),
  badRequest: (body, headers) => errorResponse(body, headers, 400),
  unauthorized: (body, headers) => errorResponse(body, headers, 401),
  forbidden: (body, headers) => errorResponse(body, headers, 403),
  notFound: (body, headers) => errorResponse(body, headers, 404),
};
