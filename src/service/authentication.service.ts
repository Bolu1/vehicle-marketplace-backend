import db from "../core/config/db";
import { IRegisterUserPayload } from "../models/interfaces/authentication.interface";
import { IUser } from "../models/interfaces/user.interface";

class AuthenticationService {
  public static async signup(payload: IRegisterUserPayload): Promise<IUser> {
    const { firstName, lastName, email, password, role } = payload;

    const result = await db.query(
      `
      INSERT INTO "users" 
      ("firstName", "lastName", "email", "password", "role")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING "id", "email", "firstName", "lastName", "role", "status", 
                "lastLoggedInAt", "createdAt", "updatedAt", "deletedAt"
      `,
      [firstName, lastName, email, password, role]
    );

    return result.rows[0];
  }

  public static async updateLastLogin(id: string): Promise<void> {
    await db.query(
      `
      UPDATE "users" 
      SET "lastLoggedInAt" = NOW() 
      WHERE "id" = $1
      `,
      [id]
    );
  }
}

export default AuthenticationService;
