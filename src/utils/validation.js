import * as Joi from 'joi';

export function userConnect(data) {
  const schema = Joi.object().keys({
    id: Joi.string().min(10).max(100).required(),
    sub_id: Joi.string().min(1).max(100).required(),
  });
  
  return Joi.validate(data, schema);
}

export function users(data) {
  const schema = Joi.object().keys({
    type: Joi.string().min(0).max(256).default(false),
    userId: Joi.string().default(false),
    sort: Joi.number().min(0).max(1).integer().default(1),
    offset: Joi.number().min(0).max(100000).integer().default(0),
    limit: Joi.number().min(1).max(1000).integer().default(100),
  });
  
  return Joi.validate(data, schema);
}
