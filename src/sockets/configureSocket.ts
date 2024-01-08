/** @format */

// sockets/socket.ts
import * as amqp from 'amqplib/callback_api';
import { format } from 'date-fns';
import { Server, Socket } from 'socket.io';
import { messageDto } from '../dto/messageDto';
import MessagesModel from '../models/MessagesModels';
// const configureSocket = async (io: Server, socket: Socket) => {
//   console.log('User connected');

//   socket.on('get-message', async (data: { from: string; to: string }) => {
//     const { from, to } = data;

//     const messages = await MessagesModel.find({
//       $or: [{ from: { $in: [from, to] } }, { to: { $in: [from, to] } }],
//     }).sort({ createdAt: 'asc' });

//     socket.emit('messages', messages);
//   });

//   socket.on('send-message', async (data: { from: string; to: string; message: string; createdAt: string }) => {
//     const currentDate = new Date();
//     const createdAt = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

//     const { from, to, message } = data;
//     data.createdAt = createdAt;

//     const messages = await new MessagesModel(data).save();
//     console.log(messages);
//     socket.broadcast.emit('messages', messages);

//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// };
const configureSocket = async (io: Server, socket: Socket, channel: amqp.Channel, queue: string) => {
  console.log('User connected');

  let messages: messageDto[];
  socket.on('get-message', async (data: { from: string; to: string }) => {
    const { from, to } = data;
    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          console.log('data ambil dr que');

          messages = JSON.parse(msg.content.toString());
        }
      },
      { noAck: true }
    );

    if (messages == undefined) {
      console.log('data ambil dr db');

      messages = await MessagesModel.find({
        $or: [{ from: { $in: [from, to] } }, { to: { $in: [from, to] } }],
      }).sort({ createdAt: 'asc' });
    }

    socket.emit('messages', messages);
  });

  socket.on('send-message', async (data: { from: string; to: string; message: string; createdAt: string }) => {
    const currentDate = new Date();
    const createdAt = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    const { from, to, message } = data;
    data.createdAt = createdAt;

    // const messages = await new MessagesModel(data).save();

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

    socket.broadcast.emit('messages', data);
    const messages = await new MessagesModel(data).save();
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

export default configureSocket;
