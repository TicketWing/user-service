export type Identification = {
  id: string;
  email: string;
};

export type InitialStep = {
  email: string;
  password: string;
};

export type FinalStep = Identification & {
  age: number;
  name: string;
};

export type Login = {
  email: string;
  password: string;
};

export type AuthRedirect = {
  redirect?: boolean;
  url?: string;
  accessToken: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
