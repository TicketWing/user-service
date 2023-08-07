import { Request } from "express";
import { Identification } from "./user.types";

export type AuthedRequest = Request & {
  identification: Identification;
};

export type ExtendedRequest<T> = Request & {
  body: T;
};

export type AuthedExtendedRequest<T> = ExtendedRequest<T> & AuthedRequest;

export type Cookies = {
  refreshToken: string;
};

export interface RequestWithCookies extends Request {
  cookies: {
    refreshToken: string;
  };
}
