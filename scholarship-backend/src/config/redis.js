const Redis = require('ioredis');

let redis;
// In-memory store factory
const createInMemoryStore = () => {
  const store = new Map();
  console.warn('⚠️  USING IN-MEMORY REDIS FALLBACK (Data will be lost on restart) ⚠️');

  return {
    get: async (key) => store.get(key) || null,
    set: async (key, value, mode, duration) => {
      store.set(key, value);
      if (mode === 'EX' && duration) {
        setTimeout(() => store.delete(key), duration * 1000);
      }
      return 'OK';
    },
    del: async (key) => store.delete(key),
    flushall: async () => store.clear(),
    quit: async () => true,
    // Add dummy event listeners to prevent crashes if code tries to listen
    on: (evt, fn) => { },
    status: 'ready'
  };
};

if (process.env.NODE_ENV === 'test') {
  console.log('Using in-memory Redis mock for tests');
  redis = createInMemoryStore();

} else if (process.env.REDIS_URL) {
  // Attempt connection but handle failure gracefully
  try {
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) {
          return null; // Stop retrying after 3 attempts
        }
        return Math.min(times * 50, 2000);
      }
    });

    client.on('error', (err) => {
      console.error('❌ Redis Connection Error:', err.message);
      // We can't easily hot-swap 'redis' export if it's already required elsewhere,
      // but this prevents unhandled crashes.
      // Ideally, the app should likely crash or we use a proxy wrapper.
      // For this user's local setup, we'll let existing operations fail or hang 
      // if they depend on this instance, BUT...
      // The Better approach for this user:
    });

    client.on('connect', () => console.log('✅ Redis Connected'));

    redis = client;
  } catch (err) {
    console.error('Failed to initialize Redis client:', err.message);
    redis = createInMemoryStore();
  }

} else {
  console.log('Redis disabled (no REDIS_URL) -> Using in-memory fallback');
  redis = createInMemoryStore();
}

// Global fallback if connection dies? 
// For simplicity in this specific broken-local-env case, 
// if REDIS_URL caused the crash earlier, it's likely because ioredis retries infinitely by default.
// The code above limits retries.

module.exports = redis;
