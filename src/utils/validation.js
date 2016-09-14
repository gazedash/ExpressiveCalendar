import * as Joi from 'joi';
import isEmpty from 'lodash/isEmpty';

function validate(payload, schema) {
  return Joi.validate(payload, schema, {
    convert: true,
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });
}

function formatError(error) {
  const details = {};
  error.details.forEach((item) => {
    details[item.path] = item.type;
  });

  return details;
}

export default (schema) => {
  const keys = Object.keys(schema);

  function validation(req, res, next) {
    const errors = Object.create(null);

    keys.forEach((key) => {
      const { error, value } = validate(req[key], schema[key]);
      if (error) {
        errors[key] = formatError(error);
      } else {
        req[key] = value;
      }
    });

    if (isEmpty(errors)) {
      next();
    } else {
      res.status(400).json({
        success: false,
        code: 400,
        message: 'Bad request',
        errors,
      });
    }
  }

  return validation;
};
