import Bcrypt from "../../src/utils/security/bcrypt";

describe("Unit test for bcrypt test", () => {
  const plainTextPassword = "123456";
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await Bcrypt.hashPassword(plainTextPassword);
  });

  it("should hash the password correctly", async () => {
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toEqual(plainTextPassword);
  });

  it("should return true when the password matches the hashed value", async () => {
    const isMatch = await Bcrypt.compare(plainTextPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it("should return false when the password does not match the hashed value", async () => {
    const isMatch = await Bcrypt.compare("wrongPassword", hashedPassword);
    expect(isMatch).toBe(false);
  });
});