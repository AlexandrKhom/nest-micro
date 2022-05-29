import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import ormConfig from './configs/ormconfig';
import { schemaValidConfig } from './configs/schema-valid.config';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,

      validationSchema: schemaValidConfig,
    }),
    TypeOrmModule.forRoot(ormConfig),
    TagModule,
    UserModule,
    AuthModule,
    BlogModule,
  ],
  providers: [AppService],
})
export class AppModule {}
