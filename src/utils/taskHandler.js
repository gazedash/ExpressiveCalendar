import logger from './logger';
// import Promise from 'bluebird';
import * as et from '../enum/EnumTypes';
import * as UserRepository from '../repositories/UserRepository';
import * as LogRepository from '../repositories/LogRepository';
import { isJson } from './helper';

// const fs = Promise.promisifyAll(require('fs'));

function onError(error) {
  logger.error(error);
}

export async function taskHandler(data, connectionParams) {
  const { id } = connectionParams;

  if (!isJson(data)) {
    onError({
      msg: 'task is not valid json',
      data,
      connectionParams,
    });
    return false;
  }

  const task = JSON.parse(data);
  // type
  const { result } = task;

  const user = await UserRepository.findByUuid(id);

  const log = await LogRepository.create({
    type: et.USER_CONNECT,
    data: result,
  });
  await user.addLog(log);

  return et.USER_CONNECT;
}
