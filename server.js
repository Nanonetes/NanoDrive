const net = require('node:net');
const fs = require('node:fs/promises');

const PORT = 5000;
const HOST = '::1';

const server = net.createServer();

server.listen(PORT, HOST, () => {
  console.log(`Server listening on`, server.address());
});

server.on('connection', socket => {
  console.log('New Connection!');
  
  socket.on('data', async (data) => {
    const fileHandle = await fs.open('serverStorage/file.txt', 'w');
    const fileStream = fileHandle.createWriteStream();
    fileStream.write(data, error => {
      if (error !== null) console.log(error);
    });
    
    fileStream.on('close', () => {
      console.log('File written!');
      fileHandle.close();
    });
  });
  
  socket.on('close', hadError => {
    hadError ? console.log('Connection closed with error') : console.log(
        'Connection closed');
  });
});
