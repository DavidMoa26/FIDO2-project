import { useNavigate } from "react-router-dom";
import React from "react";

function base64urlToArrayBuffer(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; ++i) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64url(buffer) {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function parseFlags(flagsByte) {
  return {
    userPresent: !!(flagsByte & 0x01),
    userVerified: !!(flagsByte & 0x04),
    backupEligible: !!(flagsByte & 0x20),
    backupState: !!(flagsByte & 0x40),
  };
}

function Dashboard({ email, authDetails, setAuthenticated }) {
  const navigate = useNavigate();

  const handleBack = () => {
    setAuthenticated(false);
    navigate("/");
  };

  let clientData = {};
  let flagsParsed = {};
  let signCount = 0;
  let signatureStr = "";
  let userHandleStr = "";

  if (authDetails?.response) {
    try {
      // Decode base64url → ArrayBuffer → string → JSON
      const clientDataBuf = base64urlToArrayBuffer(
        authDetails.response.clientDataJSON
      );
      const clientDataText = new TextDecoder().decode(clientDataBuf);
      clientData = JSON.parse(clientDataText);
    } catch {
      clientData = {};
    }

    try {
      const authDataBytes = new Uint8Array(
        base64urlToArrayBuffer(authDetails.response.authenticatorData)
      );
      const flags = authDataBytes[32];
      flagsParsed = parseFlags(flags);
      signCount =
        (authDataBytes[33] << 24) |
        (authDataBytes[34] << 16) |
        (authDataBytes[35] << 8) |
        authDataBytes[36];
    } catch {
      flagsParsed = {};
      signCount = 0;
    }

    try {
      const signatureBytes = base64urlToArrayBuffer(
        authDetails.response.signature
      );
      signatureStr = btoa(
        String.fromCharCode(...new Uint8Array(signatureBytes))
      );
    } catch {
      signatureStr = "N/A";
    }

    try {
      if (authDetails.response.userHandle) {
        const userHandleBytes = base64urlToArrayBuffer(
          authDetails.response.userHandle
        );
        userHandleStr = arrayBufferToBase64url(userHandleBytes);
      }
    } catch {
      userHandleStr = "N/A";
    }
  }

  return (
    <div className="container">
      <button onClick={handleBack}>Logout</button>
      <h2>Welcome, {email}</h2>
      <p>You are now logged in!</p>

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h3>🔍 Authentication Details</h3>

        <h4>📝 Client Data</h4>
        <ul>
          <li>
            <b>Type:</b> {clientData.type || "N/A"}
          </li>
          <li>
            <b>Challenge:</b> {clientData.challenge || "N/A"}
          </li>
          <li>
            <b>Origin:</b> {clientData.origin || "N/A"}
          </li>
          <li>
            <b>Cross-Origin:</b> {clientData.crossOrigin ? "Yes" : "No"}
          </li>
        </ul>

        <h4>✍️ Authenticator Data</h4>
        <ul>
          <li>
            <b>User Present:</b> {flagsParsed.userPresent ? "✔️" : "❌"}
          </li>
          <li>
            <b>User Verified:</b> {flagsParsed.userVerified ? "✔️" : "❌"}
          </li>
          <li>
            <b>Backup Eligible:</b> {flagsParsed.backupEligible ? "✔️" : "❌"}
          </li>
          <li>
            <b>Backup State:</b> {flagsParsed.backupState ? "✔️" : "❌"}
          </li>
          <li>
            <b>Sign Count:</b> {signCount}
          </li>
        </ul>

        <h4>🔐 Signature</h4>
        <code style={{ wordBreak: "break-all" }}>{signatureStr}</code>

        <h4>🪪 User Handle</h4>
        <code style={{ wordBreak: "break-all" }}>{userHandleStr || "N/A"}</code>
      </div>
    </div>
  );
}

export default Dashboard;
