module.exports = (io, socket, db) => {
  const getUsers = async () => {
    io.in(socket.roomId).emit('users', await db.getUsers(socket.roomId));
  };

  const addUser = async (user) => {
    await db.createUser(user);
    //makes sure we are updating the whole list of users in the room
    getUsers(socket.roomId);
  };

  //changing status of the user
  const removeUser = async () => {
    await db.updateUser(socket.userId, { isOnline: false });
    getUsers(socket.roomId);
  };

  //registering our functions
  socket.on('user:get', getUsers);
  socket.on('user:add', addUser);
  socket.on('disconnect', removeUser);
};
