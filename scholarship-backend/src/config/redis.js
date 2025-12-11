const Redis = require('ioredis');

let redis;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('connect', () => console.log('Redis Connected'));
  redis.on('error', (err) => console.error('Redis Error', err));
} else {
  console.warn('Redis disabled: no REDIS_URL provided');

  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null
  };
}

module.exports = redis;
