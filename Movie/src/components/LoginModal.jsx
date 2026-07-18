import logo from "../assets/logo.jpg";
import { useState } from "react";
import { saveAuthState } from "../utils/authStorage";
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";

export default function LoginModal({
    onClose,
    onForgotPassword,
    onLoginSuccess = () => {},
}) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const payload = {
            identifier: String(formData.get("identifier") || "").trim(),
            password: String(formData.get("password") || ""),
        };

        try {
            setIsSubmitting(true);

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseText = await response.text();

            console.log("Login status:", response.status);
            console.log("Login response:", responseText);


            let responseData = null;

            if (responseText) {
                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = {
                        message: responseText,
                    };
                }
            }

            if (!response.ok) {
                setAlertMessage(responseData?.message || "Unable to log in.");
                return;
            }

            const adminResponse = await fetch(
                "http://localhost:8080/api/auth/is-admin",
                {
                    headers: {
                    Authorization: `Bearer ${responseData.sessionToken}`,
                    },
                }
                );

                if (!adminResponse.ok) {
                throw new Error("Unable to determine account type.");
                }

              const adminData = await adminResponse.json();

console.log("Admin response:", adminData);
console.log(
  "isAdmin value:",
  typeof adminData === "boolean" ? adminData : adminData.isAdmin
);

const isAdmin =
    typeof adminData === "boolean"
        ? adminData
        : adminData.isAdmin;

                const authData = {
                    ...responseData,
                    isAdmin,
                };

                saveAuthState(authData);
                onLoginSuccess(authData);
                onClose();

                window.location.reload();

                if (isAdmin === true) {
                    navigate("/admin");
                }
        } catch (error) {
            console.error("Login request failed:", error);
            alert("Unable to connect to the backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-[1000]"
            onClick={onClose}
        >
            <div
                className="relative bg-[#121212] border border-[#003D1A] rounded-xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors"
                    onClick={onClose}
                >
                    ✕
                </button>

                <div className="flex flex-col items-center gap-5">
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-16 w-16"
                        />

                        <p className="text-2xl font-bold text-white">
                            Log In
                        </p>
                    </div>

                    <form
                        className="flex flex-col items-center gap-6 mt-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex items-center">
                            <label
                                htmlFor="identifier"
                                className="w-28 text-[#D4AF37] text-left"
                            >
                                Email or Username:
                            </label>

                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2 text-white"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="password"
                                className="w-28 text-[#D4AF37] text-left"
                            >
                                Password:
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2 text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#003D1A] text-[#D4AF37] px-4 py-2 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Logging In..." : "Log In"}
                        </button>
                    </form>

                    <button
                        type="button"
                        className="text-[#D4AF37] hover:underline mt-2"
                        onClick={onForgotPassword}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>

            {alertMessage && (
                <AlertModal
                message={alertMessage}
                onClose={() => setAlertMessage("")}
                />
            )}
        </div>
    );
}
