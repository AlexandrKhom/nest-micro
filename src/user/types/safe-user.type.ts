import { UserType } from './user.type';

export type SafeUserType = Omit<UserType, 'password'>;
