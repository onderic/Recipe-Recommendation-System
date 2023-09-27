import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // check if the user exists
    const existingUser = await this.UserModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // Generate a salt for password hashing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const createdUser = new this.UserModel({
      username,
      email,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.UserModel.findOne({ email }).exec();
    console.log('Returned User:', user);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.UserModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    }).exec();
  }

  // async remove(id: string): Promise<User> {
  //   return this.UserModel.findByIdAndRemove(id).exec();
  // }
}
