export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SUPERUSER" | "USER";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  lastLoggedInAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface IUnsanitizedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "SUPERUSER" | "USER";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  lastLoggedInAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
