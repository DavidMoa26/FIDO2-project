import { base64urlToBuffer } from "../utils";
import { parseFlags } from "../utils";

describe("FIDO2 Client-side Validation", () => {
  const clientDataBase64 =
    "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoicmhFajRzTVFLUmMtNTNrbGljbnZCUFdUaWlHN216Q192X0V4SUtlUzA0byIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImNyb3NzT3JpZ2luIjpmYWxzZX0";
  const authenticatorDataBase64 =
    "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAFg";

  it("parses clientDataJSON and validates fields", () => {
    const buf = base64urlToBuffer(clientDataBase64);
    const clientData = JSON.parse(new TextDecoder().decode(buf));

    expect(clientData.type).toBe("webauthn.get");
    expect(clientData.origin).toBe("http://localhost:5173");
    expect(clientData.challenge).toBe(
      "rhEj4sMQKRc-53klicnvBPWTiiG7mzC_v_ExIKeS04o"
    );
    expect(clientData.crossOrigin).toBe(false);
  });

  it("parses authenticatorData flags", () => {
    const authBuf = base64urlToBuffer(authenticatorDataBase64);
    const flags = authBuf[32];
    const parsed = parseFlags(flags);

    expect(parsed.userPresent).toBe(true);
    expect(parsed.userVerified).toBe(true);
    expect(parsed.backupEligible).toBe(false);
    expect(parsed.backupState).toBe(false);
  });
});
