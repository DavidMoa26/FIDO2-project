export function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  return new Uint8Array(
    atob(base64 + pad)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
}

export function parseFlags(flagsByte) {
  return {
    userPresent: !!(flagsByte & 0x01),
    userVerified: !!(flagsByte & 0x04),
    backupEligible: !!(flagsByte & 0x20),
    backupState: !!(flagsByte & 0x40),
  };
}
