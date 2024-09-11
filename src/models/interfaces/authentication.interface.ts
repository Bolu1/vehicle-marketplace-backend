import { IUser } from "./user.interface";

  export interface IRegisterUserPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "SUPERUSER" | "USER";
  }
  
  export interface ILoginUserPayload {
    email: string;
    password: string;
  }

  export interface ILoginUserResponseData {
    token: string;
    loggedInUser: IUser;
  }