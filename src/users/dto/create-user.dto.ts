import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  USER = 'user',
  SUPERADMIN = 'superadmin',
}

export class CreateUserDto {
  id?: string; // Optional 'id' field
  @IsNotEmpty()
  @IsString({ message: 'Username must be a string.' })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  role: UserRole;
  refreshToken: string;
  lastLogin: string;
  createdAt: Date;
  updatedAt: Date;
}
