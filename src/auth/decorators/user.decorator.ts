import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserEntity } from '../../user/entities/user.entity';

export const UserDec = createParamDecorator(
  (data: any, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user;
    // req.user.currentRefreshToken = undefined;
    user.password = undefined;
    user.email = undefined;
    console.log('UserDec', user);

    return data ? user?.[data] : user;
  },
);
