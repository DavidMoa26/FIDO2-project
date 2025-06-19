// App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EmailInput from "./components/EmailInput";
import AuthButtons from "./components/AuthButtons";
import Modal from "./components/Modal";
import Dashboard from "./pages/Dashboard";

function App() {
  const [email, setEmail] = useState("");
  const [modalText, setModalText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authDetails, setAuthDetails] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <div className="container">
                <h1>🔐 Passkey Login</h1>
                <EmailInput email={email} setEmail={setEmail} />
                <AuthButtons
                  email={email}
                  onSuccess={(details) => {
                    setAuthenticated(true);
                    setAuthDetails(details);
                  }}
                  showModal={(msg) => {
                    setModalText(msg);
                    setShowModal(true);
                  }}
                  setShowModal={setShowModal}
                />
                {showModal && (
                  <Modal text={modalText} onClose={() => setShowModal(false)} />
                )}
              </div>
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            authenticated ? (
              <Dashboard
                email={email}
                authDetails={authDetails}
                setAuthenticated={setAuthenticated}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
