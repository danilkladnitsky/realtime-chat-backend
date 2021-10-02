require('dotenv').config();

const Database = require('./db');
const db = new Database();

const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

//socket`s events handlers
const registerMessageHandlers = require('./handlers/messageHandlers');
const registerUserHandlers = require('./handlers/userHandlers');

const onConnection = (socket) => {
  //creating and joining room
  const { roomId, userId } = socket.handshake.query;
  socket.roomId = roomId;
  socket.userId = userId;
  socket.join(roomId);

  socket.on('disconnect', () => {
    socket.leave(socket.roomId);
  });

  //registering handlers
  registerMessageHandlers(io, socket, db);
  registerUserHandlers(io, socket, db);
};
io.on('connection', onConnection);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server launched on PORT: ${PORT}`);
});
