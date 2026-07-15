import React, { useState } from "react";
import NavBar from "./NavBar";
import logo from "../assets/logo.jpg";
import LoginModal from "./LoginModal";

const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const user = {
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        username: formData.get("username"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };

    try {
        const response = await fetch(
            "http://localhost:8080/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            }
        );

        const responseText = await response.text();

        if (response.ok) {
            alert("Account created! Please check your email to verify it.");
            event.currentTarget.reset();
        } else {
            alert(responseText || "Unable to create account.");
        }
    } catch (error) {
        console.error("Registration request failed:", error);
        alert("Unable to connect to the backend.");
    }
};

export default function SignUpPage() {
    const [showLogIn, setShowLogIn] = useState(false);

    return (
        <>
            <NavBar
                booking={true}
                isSignUpPage={true}
                onLogIn={() => setShowLogIn(true)}
            />

            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0b0b] px-4">
                <div
                    className="w-full max-w-lg min-h-[600px] rounded-3xl border-1 border-[#D4AF37]
                    bg-black/90 p-8 shadow-xl flex justify-center items-center flex-col mt-10 mb-10"
                >
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-16 w-16"
                        />

                        <p className="text-2xl font-bold text-white">
                            Create an Account
                        </p>
                    </div>

                    <form
                        className="flex flex-col items-start justify-start gap-10 mt-10"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex items-center">
                            <label
                                htmlFor="firstname"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                First Name:
                            </label>

                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="lastname"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                Last Name:
                            </label>

                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="username"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                Username:
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="email"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                Email:
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="phoneNumber"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                Phone:
                            </label>

                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="password"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                Password:
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                minLength={8}
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label
                                htmlFor="confirmPassword"
                                className="w-24 text-[#D4AF37] text-left"
                            >
                                Confirm Password:
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                minLength={8}
                                required
                                className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2"
                            />
                        </div>

                        <div className="w-full flex justify-center items-center">
                            <button
                                type="submit"
                                className="bg-[#003D1A] text-[#D4AF37] px-4 py-1.5 rounded-lg
                                border border-[#D4AF37] hover:bg-[#0a5229] transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showLogIn && (
                <LoginModal
                    onClose={() => setShowLogIn(false)}
                />
            )}
        </>
    );
}