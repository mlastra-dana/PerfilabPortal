const validTokens: Record<string, { expiresAt: string }> = {
  "demo-valid-001": { expiresAt: "2026-12-31T23:59:59Z" },
  "demo-valid-002": { expiresAt: "2026-03-30T23:59:59Z" },
  "lab-temporal-123": { expiresAt: "2026-03-10T23:59:59Z" },
};

export function validateDemoToken(token: string) {
  const item = validTokens[token];
  if (!item) return { valid: false as const, reason: "invalid" as const };

  const exp = new Date(item.expiresAt).getTime();
  if (Date.now() > exp) return { valid: false as const, reason: "expired" as const };

  return { valid: true as const, expiresAt: item.expiresAt };
}
