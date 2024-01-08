"use strict";
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
exports.login = exports.chat = exports.index = exports.insertMessage = exports.getMessage = void 0;
/** @format */
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const MessagesModels_1 = __importDefault(require("../models/MessagesModels"));
const UsersModels_1 = __importDefault(require("../models/UsersModels"));
let access_token;
let email_login;
function getMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let mr;
        let from = req.body.from;
        let to = req.body.to;
        let user = yield UsersModels_1.default.findOne({ email: from });
        if (user == null) {
            mr = {
                message: 'Email not Found',
                status: 400,
                payload: [],
            };
            return res.status(400).json(mr);
        }
        else {
            try {
                const message = yield MessagesModels_1.default.find({ from: from, to: to });
                mr = {
                    message: 'success',
                    status: 200,
                    payload: message,
                };
                return res.status(200).json(mr);
            }
            catch (error) {
                mr = {
                    message: String(error),
                    status: 500,
                    payload: [],
                };
                return res.status(500).json(mr);
            }
        }
    });
}
exports.getMessage = getMessage;
function insertMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let mr;
        let messageDto = req.body;
        const currentDate = new Date();
        const formattedDate = (0, date_fns_1.format)(currentDate, 'yyyy-MM-dd HH:mm:ss');
        messageDto.createdAt = formattedDate;
        // const errors = await validate(messageDto);
        try {
            const messageResult = yield new MessagesModels_1.default(messageDto).save();
            mr = {
                message: 'success',
                status: 200,
                payload: messageResult,
            };
            return res.status(200).json(mr);
        }
        catch (error) {
            mr = {
                message: String(error),
                status: 500,
                payload: [],
            };
            return res.status(500).json(mr);
        }
    });
}
exports.insertMessage = insertMessage;
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('index');
    });
}
exports.index = index;
function chat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            email: req.session.email,
        };
        res.render('message', { data });
    });
}
exports.chat = chat;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = req.body.email;
        let password = req.body.password;
        try {
            const response = yield axios_1.default.post('http://profile-app:3000/api/login', {
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            access_token = response.data.access_token;
            req.session.email = email;
            res.redirect('/messages-app/chat');
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
exports.login = login;
