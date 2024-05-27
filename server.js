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
    fileHandle = await fs.open('serverStorage/file.txt', 'w');
    fileStream = fileHandle.createWriteStream();
    fileStream.write(data, error => {
      if (error !== null) console.log(error);
    });
  });
  
  socket.on('close', (hadError) => {
    if (hadError)
      console.log('Connection closed with error');
    else
      console.log('File received');
    console.log('Connection closed');
    fileHandle.close();
    server.close();
  });
});
