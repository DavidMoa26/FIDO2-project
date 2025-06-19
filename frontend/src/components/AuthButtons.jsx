import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

const SERVER_URL = "http://localhost:3000";

function AuthButtons({ email, setModalText, setShowModal, onSuccess }) {
  async function showModal(text) {
    setModalText(text);
    setShowModal(true);
  }

  async function signup() {
    try {
      const res = await fetch(`${SERVER_URL}/init-register?email=${email}`, {
        credentials: "include",
      });
      const options = await res.json();
      if (!res.ok) return showModal(options.error);

      const regData = await startRegistration(options);

      const verify = await fetch(`${SERVER_URL}/verify-register`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });

      const verifyRes = await verify.json();
      if (!verify.ok) return showModal(verifyRes.error);

      if (verifyRes.verified) {
        showModal(`Successfully registered ${email}`);
      }

      showModal(
        verifyRes.verified
          ? `Successfully registered ${email}`
          : `Failed to register`
      );
    } catch (err) {
      showModal("Registration failed: " + err.message);
    }
  }

  async function login() {
    try {
      const res = await fetch(`${SERVER_URL}/init-auth?email=${email}`, {
        credentials: "include",
      });
      const options = await res.json();
      if (!res.ok) return showModal(options.error);

      const authData = await startAuthentication(options);

      const verify = await fetch(`${SERVER_URL}/verify-auth`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
      });

      const verifyRes = await verify.json();
      if (!verify.ok) return showModal(verifyRes.error);

      console.log("🧾 Final auth details sent to dashboard:", authData);

      if (verifyRes.verified) {
        setShowModal(false);
        onSuccess(authData);
      } else {
        showModal("Failed to log in");
      }
    } catch (err) {
      console.log(err.message);
      showModal("Login failed");
    }
  }

  return (
    <>
      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Log In</button>
    </>
  );
}

export default AuthButtons;
