"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __importStar(require("amqplib/callback_api"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const db_1 = require("./db/db");
const routes_1 = __importDefault(require("./routes/routes"));
const configureSocket_1 = __importDefault(require("./sockets/configureSocket"));
const App = (0, express_1.default)();
const server = http_1.default.createServer(App);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const port = 4000;
const rabbitMQUrl = 'amqp://localhost';
App.use((0, express_session_1.default)({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
}));
App.use(body_parser_1.default.json());
App.use(body_parser_1.default.urlencoded({ extended: true }));
App.set('views', path_1.default.join(__dirname, 'view'));
App.set('view engine', 'ejs');
(0, db_1.connectMongo)();
amqp.connect(rabbitMQUrl, (err, connection) => {
    if (err) {
        console.log('error rabit mq', err);
    }
    connection.createChannel((err, channel) => {
        if (err) {
            console.log('error channel mq', err);
        }
        const queue = 'messages';
        channel.assertQueue(queue, { durable: false });
        io.on('connection', (socket) => {
            (0, configureSocket_1.default)(io, socket, channel, queue);
        });
    });
});
App.use('/messages-app', routes_1.default);
// App.listen(port, () => {
//   console.log(`Server is running in port ${port}`);
// });
server.listen(port, () => {
    console.log('running on port ', port);
});
exports.default = App;
