import NavBar from "./Navbar";
import LoginModal from './LoginModal';
import ResetModal from './ResetModal';
import { useState } from "react";
import { clearAuthState, loadAuthState } from "../utils/authStorage";


export default function EmailConfirmation() {
    const [showLogIn, setShowLogIn] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
     const [auth, setAuth] = useState(() => loadAuthState());
    
    const handleLoginSuccess = () => {
        setAuth(loadAuthState());
      };
    
    const handleLogout = async () => {
        if (!auth.token) {
            clearAuthState();
            setAuth(loadAuthState());
            return;
        }
    
        try {
          await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: auth.token }),
          });
        } catch (error) {
          console.error('Logout request failed:', error);
        } finally {
          clearAuthState();
          setAuth(loadAuthState());
        }
    };

    return(
        <>
            <NavBar booking={true} onLogIn={() => setShowLogIn(true)} isLoggedIn={Boolean(auth.token)} onLogout={handleLogout}/>
            <div className="flex mt-10 flex-col items-center justify-center gap-5">
                <h2>
                    Your email was successfully confirmed!
                </h2>
                <h2>
                    You can now log in to your account.
                </h2>
            </div>

            {showLogIn && (<LoginModal onClose={() => setShowLogIn(false)} onForgotPassword={() => {setShowLogIn(false), setShowResetModal(true)}}/>)}
            {showResetModal && (<ResetModal onClose={() => setShowResetModal(false)} />)}
        </>
    );
}