export interface IGoogleLogin {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  accessToken: string;
  providerId: string;
  avatar: string;
  provider: 'GOOGLE';
}
