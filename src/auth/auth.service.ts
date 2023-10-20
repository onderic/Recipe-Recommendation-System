import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import AuthToken from '../types/authToken';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, plainPassword: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
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

      await this.userRepository.update(user.id, { lastLogin: new Date() });

      return await this.loginToken(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async loginToken(user: User): Promise<AuthToken> {
    const payload: JwtPayload = {
      _id: user.id,
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

      await this.userRepository.update(user.id, { refreshToken: refreshToken });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async refresh(refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { refreshToken },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.loginToken(user);
  }

  async signOut(_id: string) {
    if (!_id) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.update(_id, {
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
