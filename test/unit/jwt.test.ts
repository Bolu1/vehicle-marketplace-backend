import Jwt from "../../src/utils/security/jwt";

describe("Unit test for JWT class", () => {
  const payload = { id: "user123"};
  let token: string;

  beforeAll(() => {
    token = Jwt.issue(payload, "1h");
  });

  it("should issue a JWT token", () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should verify the issued token and return the correct payload", () => {
    const decoded = Jwt.verify(token);
    expect(decoded.payload).toEqual(payload);
  });

  it("should throw an error for an invalid token", () => {
    const invalidToken = "invalid.token.value";

    expect(() => Jwt.verify(invalidToken)).toThrow();
  });

  it("should throw an error for an expired token", () => {
    const expiredToken = Jwt.issue(payload, "1ms");

    // Wait for the token to expire
    setTimeout(() => {
      expect(() => Jwt.verify(expiredToken)).toThrow();
    }, 10);
  });
});