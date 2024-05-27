const net = require('node:net');
const fs = require('node:fs/promises');

const PORT = 5000;
const HOST = '::1';

let fileHandle, fileWriteStream;

const server = net.createServer();

server.listen(PORT, HOST, () => {
  console.log(`Server listening on`, server.address());
});

server.on('connection', socket => {
  console.log('New Connection!!');
  
  socket.on('data', async (data) => {
    if (!fileHandle) {
      socket.pause();
      fileHandle = await fs.open('./file.txt', 'w');
      fileWriteStream = fileHandle.createWriteStream();
      
      fileWriteStream.write(data);
      
      socket.resume();
      fileWriteStream.on('drain', () => {
        socket.resume();
      });
      
    } else {
      if (!fileWriteStream.write(data)) socket.pause();
    }
  });
  
  socket.on('end', () => {
    console.log('Connection ended!');
    fileHandle.close();
    server.close();
  });
});
