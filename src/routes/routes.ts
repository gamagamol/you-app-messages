/** @format */

import { Router } from 'express';
import { chat, getMessage, index, insertMessage, login } from '../controllers/MessagesController';
import { auth } from '../middleware/jwt';
const routes = Router();

routes.get('/', index);
routes.post('/login', login);
routes.get('/chat', chat);
routes.post('/get_message', auth, getMessage);
routes.post('/send_message', auth, insertMessage);

export default routes;
