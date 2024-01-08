/** @format */

import * as amqp from 'amqplib/callback_api';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { connectMongo } from './db/db';
import routes from './routes/routes';
import configureSocket from './sockets/configureSocket';

const App = express();
const server = http.createServer(App);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const port: number = 4000;
const rabbitMQUrl = 'amqp://localhost';

App.use(
  session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
  })
);

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));

App.set('views', path.join(__dirname, 'view'));

App.set('view engine', 'ejs');

connectMongo();

amqp.connect(rabbitMQUrl, (err, connection) => {
  if (err) {
    console.log('error rabit mq', err);
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.log('error channel mq', err);
    }

    const queue: string = 'messages';
    channel.assertQueue(queue, { durable: false });

    io.on('connection', (socket) => {
      configureSocket(io, socket, channel, queue);
    });
  });
});

App.use('/messages-app', routes);

// App.listen(port, () => {
//   console.log(`Server is running in port ${port}`);
// });
server.listen(port, () => {
  console.log('running on port ', port);
});

export default App;
