import { useState } from "react";
import AlertModal from "./AlertModal";

export default function ReceiptEmailModal({
    currentEmail,
    onClose,
    onSave,
}) {
    const [email, setEmail] = useState(currentEmail || "");
    const [alertMessage, setAlertMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const cleanedEmail = email.trim();

        if (!cleanedEmail) {
            setAlertMessage("Please enter an email address.");
            return;
        }

        if (!cleanedEmail.includes("@")) {
            setAlertMessage("Please enter a valid email address.");
            return;
        }

        onSave(cleanedEmail);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-[1000]"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm relative bg-[#121212] border border-[#003D1A] rounded-xl p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors"
                    onClick={onClose}
                >
                    ✕
                </button>

                <div className="flex flex-col items-center justify-center gap-5">
                    <h2 className="text-2xl text-[#D4AF37] mt-4">
                        Receipt Email
                    </h2>

                    <p className="text-sm text-gray-300 text-center">
                        Enter the email address where you want the receipt sent.
                    </p>

                    <form
                        className="w-full flex flex-col gap-6 mt-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="receiptEmail"
                                className="text-[#D4AF37]"
                            >
                                Email:
                            </label>

                            <input
                                type="email"
                                id="receiptEmail"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                className="w-full bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-3 py-2 text-white"
                                placeholder="example@email.com"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 bg-[#003D1A] text-[#D4AF37] px-4 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229] transition-colors"
                        >
                            Use This Email
                        </button>
                    </form>
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