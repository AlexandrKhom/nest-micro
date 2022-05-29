import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
})
export class UserModule {}
