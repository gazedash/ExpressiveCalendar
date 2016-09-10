import Promise from 'bluebird';
import Redis from 'redis';
import { throwError } from './utils/helper';

Promise.promisifyAll(Redis.RedisClient.prototype);
Promise.promisifyAll(Redis.Multi.prototype);
// let client = redis.createClient('6379', '0.0.0.0');

const client = Redis.createClient('6379', 'redis', {
  retry_strategy(options) {
    if (options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 60) {
      // End reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.times_connected > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    console.log('tick');
    return Math.max(options.attempt * 10, 30);
  },
});

export function checkRedis() {
  client.sadd('test', ['test1', 'test2'], (err, res) => {
    if (err) {
      console.log('Error:', res, err);
      throwError(err);
    }
    console.log('Redis is ok');
    return '123';
  });
}

export default client;
