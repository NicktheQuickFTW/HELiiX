const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Test Server Works!</h1>');
});
server.listen(4000, () => {
  console.log('Test server running on http://localhost:4000');
});