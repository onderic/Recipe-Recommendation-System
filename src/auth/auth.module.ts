import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { User } from '../users/entities/user.entity'; // Import the User entity
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register the User entity

    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
