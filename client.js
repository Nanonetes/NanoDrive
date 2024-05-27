const net = require('node:net');
const fs = require('node:fs/promises');

const PORT = 5000;
const HOST = '::1';

let fileHandle, fileReadStream;

socket = net.createConnection(PORT, HOST, async () => {
  const filePath = './test.txt';
  fileHandle = await fs.open(filePath, 'r');
  fileReadStream = fileHandle.createReadStream();
  
  fileReadStream.on('data', (data) => {
    if (!socket.write(data)) {
      fileReadStream.pause();
    }
  });
  
  socket.on('drain', () => {
    fileReadStream.resume();
  });
  
  fileReadStream.on('end', () => {
    console.log(`File ${filePath} uploaded successfully!`);
    socket.end();
  });
});
