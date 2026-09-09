import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password", () => {
  it("verifies a correct password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    await expect(
      verifyPassword("correct horse battery staple", hash),
    ).resolves.toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });

  it("never stores the plaintext", async () => {
    const hash = await hashPassword("hunter2");
    expect(hash).not.toContain("hunter2");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("returns false rather than throwing on empty or malformed input", async () => {
    await expect(verifyPassword("", "")).resolves.toBe(false);
    await expect(verifyPassword("x", "not-a-hash")).resolves.toBe(false);
  });
});
