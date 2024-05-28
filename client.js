const net = require('node:net');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = 5000;
const HOST = '::1';

let fileHandle, fileReadStream;

socket = net.createConnection(PORT, HOST, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  fileHandle = await fs.open(filePath, 'r');
  fileReadStream = fileHandle.createReadStream();
  
  socket.write(`fileName: ${fileName}-------`);
  
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
    fileHandle.close();
    fileHandle = null;
    fileReadStream = null;
    socket.end();
  });
});
