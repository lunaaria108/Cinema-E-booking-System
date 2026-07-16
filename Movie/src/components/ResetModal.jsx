import { useState } from "react";

export default function ResetModal({ onClose }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "").trim();

        try {
            setIsSubmitting(true);

            const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
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
                alert(responseData?.message || "Unable to send reset instructions.");
                return;
            }

            alert(responseData?.message || "Please check your email for password reset instructions.");
            onClose();
        } catch (error) {
            console.error("Forgot password request failed:", error);
            alert("Unable to connect to the backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
         <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-1000" onClick={onClose}>
            <div className="w-full max-w-sm relative bg-[#121212] border border-[#003D1A] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors" onClick={onClose}>✕</button>
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex flex-col items-center gap-4">
                        <form className ="flex flex-col items-center justify-center gap-10 mt-10" onSubmit={handleSubmit}>
                            <div className="flex items-center">
                                <label htmlFor="email" className="w-24 text-[#D4AF37] text-left">
                                    Email:
                                </label>
                                <input type="email" id="email" name="email" required className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2" />
                            </div>
                            <button type="submit" className="w-50 h-12.5 bg-[#003D1A] text-[#D4AF37] px-4 py-1.5 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229]
                             transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>        
    );
}
