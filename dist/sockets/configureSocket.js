"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const MessagesModels_1 = __importDefault(require("../models/MessagesModels"));
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
const configureSocket = (io, socket, channel, queue) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('User connected');
    let messages;
    socket.on('get-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { from, to } = data;
        channel.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (msg) {
                console.log('data ambil dr que');
                messages = JSON.parse(msg.content.toString());
            }
        }), { noAck: true });
        if (messages == undefined) {
            console.log('data ambil dr db');
            messages = yield MessagesModels_1.default.find({
                $or: [{ from: { $in: [from, to] } }, { to: { $in: [from, to] } }],
            }).sort({ createdAt: 'asc' });
        }
        socket.emit('messages', messages);
    }));
    socket.on('send-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const currentDate = new Date();
        const createdAt = (0, date_fns_1.format)(currentDate, 'yyyy-MM-dd HH:mm:ss');
        const { from, to, message } = data;
        data.createdAt = createdAt;
        // const messages = await new MessagesModel(data).save();
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        socket.broadcast.emit('messages', data);
        const messages = yield new MessagesModels_1.default(data).save();
    }));
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
exports.default = configureSocket;
