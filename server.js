const net = require('node:net');
const fs = require('node:fs/promises');

const PORT = 5000;
const HOST = '::1';

let fileHandle, fileStream;

const server = net.createServer();

server.listen(PORT, HOST, () => {
  console.log(`Server listening on`, server.address());
});

server.on('connection', socket => {
  console.log('New Connection!!');
  
  socket.on('data', async (data) => {
    if (!fileHandle) {
      fileHandle = await fs.open('file.txt', 'w');
      fileStream = fileHandle.createWriteStream();
      
      fileStream.write(data);
      socket.on('drain', () => {
        socket.resume();
      });
    } else {
      if (!fileStream.write(data)) {
        socket.pause();
      }
    }
  });
  
  socket.on('end', () => {
    console.log('Connection ended!');
  });
});
