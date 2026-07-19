import { createContext, useContext, useState } from "react";
import {
    loadAuthState,
    saveAuthState,
    clearAuthState,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(loadAuthState());

    const login = (responseData) => {
        saveAuthState(responseData);
        setAuth(loadAuthState());
    };

    const logout = async () => {
        if (auth.token) {
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
                console.error("Logout failed:", error);
            }
        }

        clearAuthState();
        setAuth(loadAuthState());
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}