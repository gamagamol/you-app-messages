/** @format */
import axios from 'axios';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { messageDto, messageResponse } from '../dto/messageDto';
import MessagesModel from '../models/MessagesModels';
import UserModel from '../models/UsersModels';

let access_token: any;
let email_login: string;

declare module 'express-session' {
  interface SessionData {
    email: any;
  }
}

export async function getMessage(req: Request, res: Response) {
  let mr: messageResponse;
  let from: string = req.body.from;
  let to: string = req.body.to;

  let user = await UserModel.findOne({ email: from });

  if (user == null) {
    mr = {
      message: 'Email not Found',
      status: 400,
      payload: [],
    };
    return res.status(400).json(mr);
  } else {
    try {
      const message = await MessagesModel.find({ from: from, to: to });

      mr = {
        message: 'success',
        status: 200,
        payload: message,
      };
      return res.status(200).json(mr);
    } catch (error) {
      mr = {
        message: String(error),
        status: 500,
        payload: [],
      };
      return res.status(500).json(mr);
    }
  }
}

export async function insertMessage(req: Request, res: Response) {
  let mr: messageResponse;
  let messageDto: messageDto = req.body;
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

  messageDto.createdAt = formattedDate;

  // const errors = await validate(messageDto);

  try {
    const messageResult = await new MessagesModel(messageDto).save();

    mr = {
      message: 'success',
      status: 200,
      payload: messageResult,
    };

    return res.status(200).json(mr);
  } catch (error) {
    mr = {
      message: String(error),
      status: 500,
      payload: [],
    };
    return res.status(500).json(mr);
  }
}

export async function index(req: Request, res: Response) {
  res.render('index');
}

export async function chat(req: Request, res: Response) {
  let data = {
    email: req.session.email,
  };
  res.render('message', { data });
}

export async function login(req: Request, res: Response) {
  let email: string = req.body.email;
  let password: string = req.body.password;

  try {
    const response = await axios.post(
      'http://localhost:3000/api/login',
      {
        email: email,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    access_token = response.data.access_token;
    req.session.email=email

    res.redirect('/messages-app/chat');
  } catch (error) {
    console.error('Error:', error);
  }
}
