import { SafeUserType } from './types/safe-user.type';
import { UserType } from './types/user.type';

export class UserMappers {
  mapUserEntityToSafeUser(user: UserType): SafeUserType {
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      picture: user.picture,
      roles: user.roles,
      updatedAt: user.updatedAt,
      username: user.username,
      verifiedEmail: user.verifiedEmail,
    };
  }

  mapUserEntitiesToSafeUsers(users: UserType[]): SafeUserType[] {
    return users.map((user) => this.mapUserEntityToSafeUser(user));
  }
}
