const net = require('node:net');
const fs = require('node:fs/promises');

const PORT = 5000;
const HOST = '::1';

socket = net.createConnection(PORT, HOST);

socket.on('connect', async () => {
  const filePath = 'localStorage/test.txt';
  const fileHandle = await fs.open(filePath, 'r');
  const readStream = fileHandle.createReadStream();
  readStream.on('data', chunk => {
    socket.write(chunk);
  });
  
  readStream.on('end', () => {
    fileHandle.close();
    console.log(`File ${filePath} uploaded successfully!`);
    socket.end();
  });
});
