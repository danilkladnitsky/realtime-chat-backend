const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const { UserSchema, MessageSchema } = require('./schemas');

module.exports = class Database {
  constructor() {
    this._connect();
    this.Users = UserSchema;
    this.Messages = MessageSchema;
  }

  //create database connection
  _connect() {
    mongoose
      .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}`
      )
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error: ' + err);
      });
  }

  //users
  async createUser({ userName, userId, roomId }) {
    if (!userName) return 'Имя пользователя не может быть пустым';

    const user = new UserSchema({
      userName,
      userId,
      roomId,
      creationDate: new Date().toISOString(),
      isOnline: true,
    });

    let result = await this.Users.findOne({ userName });

    //if the user exists we`ll just update him
    if (result === null) {
      await user.save();
      return user;
    } else {
      await this.Users.updateOne(
        { userName },
        { userId, roomId, isOnline: true }
      );
      return result;
    }
  }

  //refactor to better update algorithm
  async updateUser(userId, update) {
    await this.Users.updateOne({ userId }, update);
    return await this.Users.find({ userId });
  }

  async getUsers(roomId) {
    return await (
      await this.Users.find({ roomId })
    ).filter((user) => user.isOnline);
  }

  //messages
  async createMessage({ senderId, messageText, roomId, senderName }) {
    if (!messageText) return;
    const message = new MessageSchema({
      messageId: nanoid(8),
      senderId,
      messageText,
      senderName,
      roomId,
      sendingDate: new Date().toISOString(),
    });

    await message.save();
    return message;
  }

  async getMessages(roomId) {
    return await this.Messages.find({ roomId });
  }
};
