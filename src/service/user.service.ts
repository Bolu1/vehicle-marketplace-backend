import db from "../core/config/db";
import { IUnsanitizedUser, IUser } from "../models/interfaces/user.interface";

class UserService {
  public static async readUserByEmail(email: string): Promise<IUser | null> {
    const result = await db.query(
      `
          SELECT "id", "email", "firstName", "lastName", "role", "status", "lastLoggedInAt", "createdAt", "updatedAt", "deletedAt" FROM "users" WHERE "email" = $1
          `,
      [email]
    );
    return result.rows[0];
  }

  public static async readUnsanitizedUserByEmail(
    email: string
  ): Promise<IUnsanitizedUser> {
    const result = await db.query(
      `
          SELECT * FROM "users" WHERE "email" = $1
          `,
      [email]
    );
    return result.rows[0];
  }

  public static async readUserById(id: string): Promise<IUser | null> {
    const result = await db.query(
      `
          SELECT "id", "email", "firstName", "lastName", "role", "status", "lastLoggedInAt", "createdAt", "updatedAt", "deletedAt" FROM "users" WHERE "id" = $1
          `,
      [id]
    );
    return result.rows[0];
  }
}

export default UserService;
