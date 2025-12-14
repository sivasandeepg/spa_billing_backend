
// src/config/redis.js
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

export default client;  