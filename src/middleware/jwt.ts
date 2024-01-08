/** @format */

import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export const SECRET_KEY: Secret = 'SECRET';

export interface JWT extends Request {
  token: string | JwtPayload;
}



export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as JWT).token = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Please Login First',
      status: 401,
    });
  }
};
