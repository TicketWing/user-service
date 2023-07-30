export type InitialStep = {
  email: string;
  password: string;
};

export type FinalStep = {
  id: string;
  age: number;
  name: string;
};

export type Login = {
  email: string;
  password: string;
};

export type AuthSucces = {
  redirect?: boolean;
  url?: string;
  token: string;
};
