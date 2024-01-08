/** @format */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class messageDto {
  @IsEmail()
  @IsNotEmpty()
  from: string;
  @IsEmail()
  @IsNotEmpty()
  to: string;

  createdAt: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class messageResponse {
  message: string;
  status: number;
  payload: any;
}

export class authDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: any;
}
