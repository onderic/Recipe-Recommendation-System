import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import AuthToken from '../types/authToken';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, plainPassword: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatch = await this.comparePasswords(
        plainPassword,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      await user.updateOne({ lastLogin: new Date() });

      return await this.loginToken(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async loginToken(user: UserDocument): Promise<AuthToken> {
    const payload: JwtPayload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
        }),
      ]);

      await user.updateOne({ refreshToken: refreshToken });
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async refresh(refreshToken: string) {
    const user = await this.userModel.findOne({ refreshToken: refreshToken });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.loginToken(user);
  }

  async signOut(_id: string) {
    if (!_id) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findByIdAndUpdate(_id, {
      refreshToken: null,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // console.log(`Token removed for user: ${user.username} (${user.email})`);
    return 'Logout successful';
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
