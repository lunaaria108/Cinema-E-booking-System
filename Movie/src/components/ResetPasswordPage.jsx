import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const tokenFromUrl = searchParams.get("token") || "";

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const payload = {
            token: String(
                formData.get("token") || tokenFromUrl
            ).trim(),
            newPassword: String(
                formData.get("newPassword") || ""
            ),
            confirmPassword: String(
                formData.get("confirmPassword") || ""
            ),
        };

        if (!payload.token) {
            setAlertMessage("A reset token is required.");
            return;
        }

        if (payload.newPassword !== payload.confirmPassword) {
            setAlertMessage("Passwords do not match.");
            return;
        }

        if (payload.newPassword.length < 8) {
            setAlertMessage("Password must be at least 8 characters long.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(
                "http://localhost:8080/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseText = await response.text();

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
                setAlertMessage(
                    responseData?.message ||
                        "Unable to reset password."
                );
                return;
            }

            setAlertMessage(
                responseData?.message ||
                    "Password updated successfully."
            );
        } catch (error) {
            console.error("Reset password request failed:", error);
            setAlertMessage("Unable to connect to the backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#121212] border border-[#003D1A] rounded-xl p-8">
                <h1 className="text-3xl text-[#D4AF37] font-bold text-center mb-8">
                    Reset Password
                </h1>

                <form
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label
                            htmlFor="token"
                            className="block text-[#D4AF37] mb-2"
                        >
                            Reset Token
                        </label>

                        <input
                            type="text"
                            id="token"
                            name="token"
                            defaultValue={tokenFromUrl}
                            required
                            readOnly={Boolean(tokenFromUrl)}
                            className="w-full bg-black border border-[#D4AF37] rounded-md px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-[#D4AF37] mb-2"
                        >
                            New Password
                        </label>

                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            minLength={8}
                            required
                            className="w-full bg-black border border-[#D4AF37] rounded-md px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-[#D4AF37] mb-2"
                        >
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            minLength={8}
                            required
                            className="w-full bg-black border border-[#D4AF37] rounded-md px-3 py-2 text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#003D1A] text-[#D4AF37] py-2 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? "Updating..."
                            : "Update Password"}
                    </button>
                </form>
            </div>
            {alertMessage && (
                <AlertModal
                    message={alertMessage}
                    onClose={() => {
                        setAlertMessage("");
                        if (alertMessage.includes("successfully")) {
                            navigate("/");
                        }
                    }}
                />
            )}
        </div>
    );
}