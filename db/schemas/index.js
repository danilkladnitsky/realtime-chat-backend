const mongoose = require('mongoose');

module.exports = {
  UserSchema: mongoose.model(
    'User',
    mongoose.Schema({
      userId: String,
      roomId: String,
      creationDate: Date,
      userName: String,
      isOnline: Boolean,
    })
  ),

  MessageSchema: mongoose.model(
    'Message',
    mongoose.Schema({
      messageId: String,
      senderId: String,
      senderName: String,
      messageText: String,
      roomId: String,
      sendingDate: Date,
    })
  ),
};
