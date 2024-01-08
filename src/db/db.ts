/** @format */

import mongoose, { ConnectOptions } from 'mongoose';

const URI = 'mongodb://localhost:27017/you_app';
export function connectMongo() {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      console.log('Connected To mongo');
    })
    .catch((error) => {
      console.log(error);
    });
}
