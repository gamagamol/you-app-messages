"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MessagesController_1 = require("../controllers/MessagesController");
const jwt_1 = require("../middleware/jwt");
const routes = (0, express_1.Router)();
routes.get('/', MessagesController_1.index);
routes.post('/login', MessagesController_1.login);
routes.get('/chat', MessagesController_1.chat);
routes.post('/get_message', jwt_1.auth, MessagesController_1.getMessage);
routes.post('/send_message', jwt_1.auth, MessagesController_1.insertMessage);
exports.default = routes;
