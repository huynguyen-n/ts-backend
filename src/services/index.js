export const hello = (event, context, callback) => callback(null, {
  body: 'Hello World',
  event,
});
