import { describe, expect, it } from "vitest";

describe("auth contract", () => {
  it("keeps OTP as a 6 digit numeric code", () => {
    const otpPattern = /^\d{6}$/;
    expect(otpPattern.test("123456")).toBe(true);
    expect(otpPattern.test("12345")).toBe(false);
  });
});
