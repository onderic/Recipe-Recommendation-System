import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from 'src/types/jwt-payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // Check if the user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // Generate a salt for password hashing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = new User();
    user.id = uuidv4();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async findAll(s_user: JwtPayload): Promise<User[]> {
    if (s_user.role !== 'superadmin') {
      throw new UnauthorizedException(
        'Only superusers can access user records!',
      );
    }
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(
    s_user: JwtPayload,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (s_user.role !== 'superadmin') {
      throw new UnauthorizedException(
        'Only superusers can update user records',
      );
    }
    // Update the user with the provided data
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    // Add more fields as needed

    return this.userRepository.save(user);
  }

  // async remove(id: string): Promise<User> {
  //   return this.userRepository.findByIdAndRemove(id).exec();
  // }
}
