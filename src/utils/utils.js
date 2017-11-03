export const checkRequiredFields = (data = {}, fields = []) =>
  fields.every(elem => Object.keys(data).indexOf(elem) !== -1);
