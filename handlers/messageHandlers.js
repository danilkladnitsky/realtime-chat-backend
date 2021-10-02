module.exports = (io, socket, db) => {
  const getMessages = async () => {
    io.in(socket.roomId).emit('messages', await db.getMessages(socket.roomId));
  };

  const addMessage = async (message) => {
    await db.createMessage({ ...message, roomId: socket.roomId });
    //makes sure we are updating the whole list of messages in the room
    getMessages();
  };

  //registering our functions
  socket.on('message:get', getMessages);
  socket.on('message:add', addMessage);
};
