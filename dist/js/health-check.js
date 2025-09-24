
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server health check: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const health = JSON.parse(data);
      console.log('🔍 Health status:', health);
      console.log('🚀 Server is running successfully!');
    } catch (error) {
      console.log('📝 Server response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Health check failed:', error.message);
  console.log('💡 Make sure the server is running on port 5000');
});

req.end();
