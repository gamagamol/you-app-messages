/** @format */

import mongoose from 'mongoose';

const MessagesSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const MessagesModel = mongoose.model('messages', MessagesSchema);



export default MessagesModel;
