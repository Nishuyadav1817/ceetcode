const { createClient }=require('redis');

const Redis = createClient({

    username: 'default',
    password:  process.env.REDIS_PASS,
    socket: {
        host: 'redis-12422.c274.us-east-1-3.ec2.cloud.redislabs.com',
        port: 12422,
       
    }
   
  
});

Redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

module.exports = Redis;