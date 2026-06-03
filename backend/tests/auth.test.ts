import { hashPassword, comparePassword, signToken, verifyToken } from "../src/services/auth.service";

describe("auth.service", () => {
  describe("hashPassword / comparePassword", () => {
    it("hashes a password and verifies it correctly", async () => {
      const hash = await hashPassword("my-secret-123");
      expect(await comparePassword("my-secret-123", hash)).toBe(true);
      expect(await comparePassword("wrong-password", hash)).toBe(false);
    });
  });

  describe("signToken / verifyToken", () => {
    it("signs and verifies a token with correct payload", () => {
      const payload = { userId: "abc-123", email: "test@example.com" };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it("throws on a tampered token", () => {
      const token = signToken({ userId: "x", email: "x@x.com" });
      expect(() => verifyToken(token + "tampered")).toThrow();
    });
  });
});
