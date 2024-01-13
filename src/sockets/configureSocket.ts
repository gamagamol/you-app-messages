/** @format */

// sockets/socket.ts
import * as amqp from 'amqplib/callback_api';
import { format } from 'date-fns';
import { Server, Socket } from 'socket.io';
import db from '../db/db';
import { messageDto } from '../dto/messageDto';
// db
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
      messages = await db.messagesModel.findMany({
        where: {
          OR: [{ from: { in: [from, to] } }, { to: { in: [from, to] } }],
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }

    socket.emit('messages', messages);
  });

  socket.on('send-message', async (data: { from: string; to: string; message: string; createdAt: string }) => {
    const currentDate = new Date();
    const createdAt = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    const { from, to, message } = data;
    data.createdAt = createdAt;

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

    socket.broadcast.emit('messages', data);
    const messages = await db.messagesModel.create({
      data: data,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

export default configureSocket;
