const net = require('node:net');
const fs = require('node:fs/promises');

const PORT = 5000;
const HOST = '::1';

let fileHandle, fileStream;

socket = net.createConnection(PORT, HOST, async () => {
  const filePath = 'test.txt';
  await uploadFile(filePath);
});

async function uploadFile(filePath) {
  fileHandle = await fs.open(filePath, 'r');
  fileStream = fileHandle.createReadStream();
  
  fileStream.on('data', chunk => {
    if (!socket.write(chunk)) {
      fileStream.pause();
    }
  });
  
  socket.on('drain', () => {
    fileStream.resume();
  });
  
  fileStream.on('end', () => {
    console.log(`File ${filePath} uploaded successfully!`);
    fileHandle.close();
    socket.end();
  });
}
