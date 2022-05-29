import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { getJWTConfig } from '../configs/jwtconfig';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { BearerStrategy } from './strategies/bearer.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    BearerStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
