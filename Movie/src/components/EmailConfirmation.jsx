import NavBar from "./Navbar";
import LoginModal from "./LoginModal";
import ResetModal from "./ResetModal";
import { useEffect, useRef, useState } from "react";
import {
  clearAuthState,
  loadAuthState,
} from "../utils/authStorage";

export default function EmailConfirmation() {
  const [showLogIn, setShowLogIn] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [auth, setAuth] = useState(() => loadAuthState());

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Confirming your email..."
  );

  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmEmail = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Confirmation token is missing.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/confirm-email?token=${encodeURIComponent(
            token
          )}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Email confirmation failed."
          );
        }

        setStatus("success");
        setMessage(
          data?.message ||
            "Your email was successfully confirmed!"
        );
      } catch (error) {
        console.error("Email confirmation failed:", error);

        setStatus("error");
        setMessage(
          error.message ||
            "Unable to confirm your email."
        );
      }
    };

    confirmEmail();
  }, []);

  const handleLoginSuccess = () => {
    setAuth(loadAuthState());
    setShowLogIn(false);
  };

  const handleLogout = async () => {
    if (!auth.token) {
      clearAuthState();
      setAuth(loadAuthState());
      return;
    }

    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: auth.token,
        }),
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuthState();
      setAuth(loadAuthState());
    }
  };

  return (
    <>
      <NavBar
        booking={true}
        onLogIn={() => setShowLogIn(true)}
        isLoggedIn={Boolean(auth.token)}
        onLogout={handleLogout}
      />

      <div className="flex mt-10 flex-col items-center justify-center gap-5">
        {status === "loading" && (
          <h2>Confirming your email...</h2>
        )}

        {status === "success" && (
          <>
            <h2>{message}</h2>

            <h2>
              You can now log in to your account.
            </h2>

            <button
              type="button"
              onClick={() => setShowLogIn(true)}
              className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
            >
              Log In
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Email confirmation failed.</h2>
            <p>{message}</p>
          </>
        )}
      </div>

      {showLogIn && (
        <LoginModal
          onClose={() => setShowLogIn(false)}
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() => {
            setShowLogIn(false);
            setShowResetModal(true);
          }}
        />
      )}

      {showResetModal && (
        <ResetModal
          onClose={() => setShowResetModal(false)}
        />
      )}
    </>
  );
}
