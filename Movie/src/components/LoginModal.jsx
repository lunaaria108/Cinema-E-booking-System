import logo from "../assets/logo.jpg";
import { useState } from "react";
import { saveAuthState } from "../utils/authStorage";

export default function LoginModal({ onClose, onForgotPassword, onLoginSuccess = () => {} }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const payload = {
            identifier: String(formData.get("email") || "").trim(),
            password: String(formData.get("password") || ""),
        };

        try {
            setIsSubmitting(true);

            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            let responseData = null;

            if (responseText) {
                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = { message: responseText };
                }
            }

            if (!response.ok) {
                alert(responseData?.message || "Unable to log in.");
                return;
            }

            saveAuthState(responseData);
            alert(responseData?.message || "Login successful.");
            onLoginSuccess(responseData);
            onClose();
        } catch (error) {
            console.error("Login request failed:", error);
            alert("Unable to connect to the backend.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-1000" onClick={onClose}>
            <div className="relative bg-[#121212] border border-[#003D1A] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors" onClick={onClose}>✕</button>
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex flex-col items-center gap-4">
                        <img src={logo} alt="Logo" className="h-16 w-16" />

                        <p className="text-2xl font-bold text-white">
                            Log In
                        </p>
                    </div>

                    <form id="login-form" className ="flex flex-col items-center justify-start gap-10 mt-10" onSubmit={handleSubmit}>
                        <div className="flex items-center">
                            <label htmlFor="email" className="w-24 text-[#D4AF37] text-left">
                                Email:
                            </label>
                            <input type="email" id="email" name="email" required className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2" />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="password" className="w-24 text-[#D4AF37] text-left">
                                Password:
                            </label>
                            <input type="password" id="password" name="password" required className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2 text-white" />
                        </div>
                    </form>

                    <div className="flex flex-col m-6 gap-6">
                        <button type="submit" form="login-form" className="w-full max-w-sm h-full max-h-12.5 bg-[#003D1A] text-[#D4AF37] px-4 py-1.5 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229]
                         transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                            {isSubmitting ? "Logging In..." : "Log In"}
                        </button>

                        <button type="button" className="text-[#D4AF37] hover:underline" onClick={onForgotPassword}>
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}