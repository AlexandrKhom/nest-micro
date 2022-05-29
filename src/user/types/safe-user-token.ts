import { SafeUserType } from './safe-user.type';

export type SafeUserWithTokensType = SafeUserType & {
  accessToken: string;
  refreshToken: string;
};
