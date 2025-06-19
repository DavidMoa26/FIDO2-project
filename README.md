# WebAuthn FIDO2 Project

This is a full-stack implementation of passwordless authentication using the FIDO2 standard (WebAuthn + CTAP). It demonstrates secure user registration and login using platform authenticators like Windows Hello.

---

## 📁 Project Structure

- `frontend/` – React app (Vite) with WebAuthn client-side logic
- `backend/` – Node.js server using Express and `@simplewebauthn/server`

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DavidMoa26/webauthn-fido.git
cd webauthn-fido
```

### 2. Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

---

## 🧪 Running the App

### Start the backend server:

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:3000`

### Start the frontend:

```bash
cd ../frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## ✅ Run Tests (Frontend only)

```bash
cd frontend
npx vitest
```

---
