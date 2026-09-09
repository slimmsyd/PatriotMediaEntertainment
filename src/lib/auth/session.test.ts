import { beforeAll, describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/lib/auth/session";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-that-is-long-enough-for-hs256";
});

describe("session", () => {
  it("round-trips a signed session", async () => {
    const token = await signSession({ userId: "abc", email: "a@b.com" });
    await expect(verifySession(token)).resolves.toEqual({
      userId: "abc",
      email: "a@b.com",
    });
  });

  it("rejects a missing token", async () => {
    await expect(verifySession(undefined)).resolves.toBeNull();
    await expect(verifySession("")).resolves.toBeNull();
  });

  it("rejects a tampered token", async () => {
    const token = await signSession({ userId: "abc", email: "a@b.com" });
    const [header, , signature] = token.split(".");
    const forged = `${header}.${Buffer.from(
      JSON.stringify({ sub: "hacker", email: "x@y.com" }),
    ).toString("base64url")}.${signature}`;
    await expect(verifySession(forged)).resolves.toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession({ userId: "abc", email: "a@b.com" });
    process.env.SESSION_SECRET = "a-completely-different-secret-value-here";
    await expect(verifySession(token)).resolves.toBeNull();
    process.env.SESSION_SECRET = "test-secret-that-is-long-enough-for-hs256";
  });

  it("refuses to sign without a usable secret", async () => {
    const saved = process.env.SESSION_SECRET;
    process.env.SESSION_SECRET = "short";
    await expect(
      signSession({ userId: "abc", email: "a@b.com" }),
    ).rejects.toThrow(/SESSION_SECRET/);
    process.env.SESSION_SECRET = saved;
  });
});
