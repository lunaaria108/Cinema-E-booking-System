import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";
import {
    clearAuthState,
    loadAuthState,
} from "../utils/authStorage";

export default function UserProfile() {
    const navigate = useNavigate();

    const [auth, setAuth] = useState(() => loadAuthState());

    const [user, setUser] = useState({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        promoOptIn: true,
    });

    const [paymentCards, setPaymentCards] = useState([]);

    const [showCardForm, setShowCardForm] = useState(false);
    const [editingCardId, setEditingCardId] = useState(null);

    const [cardForm, setCardForm] = useState({
        cardholderName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvv: "",
        billingZip: "",
    });

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        if (!auth.userId) {
            setIsLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/users/${auth.userId}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Unable to load profile: ${response.status}`
                    );
                }

                const data = await response.json();

                setUser((currentUser) => ({
                    ...currentUser,
                    userName: data.userName || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    streetAddress: data.streetAddress || "",
                    promoOptIn:
                        data.promoOptIn !== undefined
                            ? data.promoOptIn
                            : currentUser.promoOptIn,
                }));
            } catch (error) {
                console.error("Profile request failed:", error);
                alert("Unable to load your profile.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [auth.userId]);

    useEffect(() => {
        if (!auth.userId) {
            setPaymentCards([]);
            return;
        }

        const loadPaymentCards = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/users/${auth.userId}/cards`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Unable to load cards: ${response.status}`
                    );
                }

                const data = await response.json();
                setPaymentCards(data);
            } catch (error) {
                console.error(
                    "Unable to load payment cards:",
                    error
                );
            }
        };

        loadPaymentCards();
    }, [auth.userId, auth.token]);

    const handleProfileChange = (event) => {
        const { name, value, type, checked } = event.target;

        setUser((currentUser) => ({
            ...currentUser,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSaveProfile = async () => {
        if (!auth.userId) {
            alert(
                "You must be logged in to update your profile."
            );
            return;
        }

        const payload = {
            userName: user.userName.trim(),
            firstName: user.firstName.trim(),
            lastName: user.lastName.trim(),
            phoneNumber: user.phoneNumber.trim(),
            streetAddress: user.streetAddress.trim(),
        };

        try {
            setIsSavingProfile(true);

            const response = await fetch(
                `http://localhost:8080/api/users/${auth.userId}`,
                {
                    method: "PUT",
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
                alert(
                    responseData?.message ||
                        "Unable to update your profile."
                );
                return;
            }

            setUser((currentUser) => ({
                ...currentUser,
                userName:
                    responseData?.userName ||
                    currentUser.userName,
                firstName:
                    responseData?.firstName ||
                    currentUser.firstName,
                lastName:
                    responseData?.lastName ||
                    currentUser.lastName,
                email:
                    responseData?.email ||
                    currentUser.email,
                phoneNumber:
                    responseData?.phoneNumber ||
                    currentUser.phoneNumber,
                streetAddress:
                    responseData?.streetAddress ||
                    currentUser.streetAddress,
            }));

            alert(
                "Profile updated successfully. A notification email has been sent."
            );
        } catch (error) {
            console.error("Profile update failed:", error);
            alert("Unable to connect to the backend.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!auth.userId) {
            alert(
                "You must be logged in to update your password."
            );
            return;
        }

        if (
            !passwords.oldPassword.trim() ||
            !passwords.newPassword.trim() ||
            !passwords.confirmPassword.trim()
        ) {
            alert("Please fill in all password fields.");
            return;
        }

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            alert(
                "New password and confirm password do not match."
            );
            return;
        }

        if (passwords.newPassword.length < 8) {
            alert(
                "The new password must be at least 8 characters."
            );
            return;
        }

        if (
            passwords.oldPassword ===
            passwords.newPassword
        ) {
            alert(
                "The new password must be different from the current password."
            );
            return;
        }

        try {
            setIsUpdatingPassword(true);

            const response = await fetch(
                `http://localhost:8080/api/auth/change-password?userId=${auth.userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentPassword:
                            passwords.oldPassword,
                        newPassword:
                            passwords.newPassword,
                        confirmPassword:
                            passwords.confirmPassword,
                    }),
                }
            );

            const responseText = await response.text();

            let responseData = null;

            if (responseText) {
                try {
                    responseData =
                        JSON.parse(responseText);
                } catch {
                    responseData = {
                        message: responseText,
                    };
                }
            }

            if (!response.ok) {
                alert(
                    responseData?.message ||
                        "Unable to update password."
                );
                return;
            }

            alert(
                responseData?.message ||
                    "Password changed successfully. Please log in again."
            );

            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            clearAuthState();
            setAuth(loadAuthState());
            navigate("/");
        } catch (error) {
            console.error(
                "Password update failed:",
                error
            );
            alert("Unable to connect to the backend.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleLogout = async () => {
        if (auth.token) {
            try {
                await fetch(
                    "http://localhost:8080/api/auth/logout",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            token: auth.token,
                        }),
                    }
                );
            } catch (error) {
                console.error(
                    "Logout request failed:",
                    error
                );
            }
        }

        clearAuthState();
        setAuth(loadAuthState());
        navigate("/");
    };

    const handleAddCard = () => {
        if (paymentCards.length >= 3) {
            return;
        }

        setEditingCardId(null);

        setCardForm({
            cardholderName: "",
            cardNumber: "",
            expirationMonth: "",
            expirationYear: "",
            cvv: "",
            billingZip: "",
        });

        setShowCardForm(true);
    };

    const handleEditCard = (card) => {
        setEditingCardId(card.cardId);

        setCardForm({
            cardholderName: card.cardholderName || "",
            cardNumber: card.cardNumber || "",
            expirationMonth:
                card.expirationMonth || "",
            expirationYear:
                card.expirationYear || "",
            cvv: card.cvv || "",
            billingZip: card.billingZip || "",
        });

        setShowCardForm(true);
    };

    const handleSaveCard = async () => {
        const cleanedCardNumber =
            cardForm.cardNumber.replace(/\s/g, "");

        if (
            !cardForm.cardholderName.trim() ||
            !cleanedCardNumber ||
            !cardForm.expirationMonth ||
            !cardForm.expirationYear ||
            !cardForm.cvv.trim() ||
            !cardForm.billingZip.trim()
        ) {
            alert("Please enter all card information.");
            return;
        }

        const payload = {
            cardholderName:
                cardForm.cardholderName.trim(),
            cardNumber: cleanedCardNumber,
            expirationMonth: Number(
                cardForm.expirationMonth
            ),
            expirationYear: Number(
                cardForm.expirationYear
            ),
            cvv: cardForm.cvv.trim(),
            billingZip: cardForm.billingZip.trim(),
        };

        try {
            const response = await fetch(
                `http://localhost:8080/api/users/${auth.userId}/cards`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${auth.token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseText = await response.text();

            let savedCard = null;

            if (responseText) {
                try {
                    savedCard =
                        JSON.parse(responseText);
                } catch {
                    throw new Error(responseText);
                }
            }

            if (!response.ok) {
                throw new Error(
                    savedCard?.message ||
                        "Unable to save payment card."
                );
            }

            setPaymentCards((currentCards) => [
                ...currentCards,
                savedCard,
            ]);

            setShowCardForm(false);
            setEditingCardId(null);

            setCardForm({
                cardholderName: "",
                cardNumber: "",
                expirationMonth: "",
                expirationYear: "",
                cvv: "",
                billingZip: "",
            });
        } catch (error) {
            console.error(
                "Saving card failed:",
                error
            );
            alert(error.message);
        }
    };

    const handleDeleteCard = async (cardId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/users/${auth.userId}/cards/${cardId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${auth.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Unable to delete card: ${response.status}`
                );
            }

            setPaymentCards((currentCards) =>
                currentCards.filter(
                    (card) => card.cardId !== cardId
                )
            );
        } catch (error) {
            console.error(
                "Deleting card failed:",
                error
            );
            alert(error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0b0b0b] text-white">
                <NavBar
                    isLoggedIn={Boolean(auth.token)}
                    onLogout={handleLogout}
                />

                <p className="p-8">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (!auth.userId) {
        return (
            <div className="min-h-screen bg-[#0b0b0b] text-white">
                <NavBar
                    isLoggedIn={Boolean(auth.token)}
                    onLogout={handleLogout}
                />

                <div className="p-8 text-center">
                    <p>
                        You must be logged in to view
                        your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-[#f5f1e8] pb-20">
            <NavBar
                isLoggedIn={Boolean(auth.token)}
                onLogout={handleLogout}
                isProfilePage={true}
            />

            <div className="max-w-6xl mx-auto p-8 mt-6">
                <h1 className="text-4xl font-bebas text-[#D4AF37] mb-8 border-b border-[#003D1A] pb-4">
                    Manage Profile
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >
                        <h2 className="text-2xl text-[#D4AF37] mb-4">
                            Personal Information
                        </h2>

                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="userName"
                                value={user.userName}
                                onChange={
                                    handleProfileChange
                                }
                                className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                placeholder="Username"
                            />

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={
                                        user.firstName
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                    placeholder="First Name"
                                />

                                <input
                                    type="text"
                                    name="lastName"
                                    value={
                                        user.lastName
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                    placeholder="Last Name"
                                />
                            </div>

                            <label className="text-gray-400 text-sm">
                                Email Address (Cannot be
                                changed)
                            </label>

                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="w-full bg-gray-900 border border-gray-700 text-gray-500 rounded p-2 cursor-not-allowed"
                            />

                            <input
                                type="tel"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={
                                    handleProfileChange
                                }
                                className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                placeholder="Phone Number"
                            />

                            <textarea
                                name="streetAddress"
                                value={
                                    user.streetAddress
                                }
                                onChange={
                                    handleProfileChange
                                }
                                rows="3"
                                maxLength={255}
                                className="w-full bg-black border border-[#003D1A] rounded p-2 text-white resize-none"
                                placeholder="Street Address"
                            />

                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="promoOptIn"
                                    checked={
                                        user.promoOptIn
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    className="accent-[#003D1A]"
                                />

                                Subscribe to promotions
                            </label>

                            <button
                                type="button"
                                onClick={
                                    handleSaveProfile
                                }
                                disabled={
                                    isSavingProfile
                                }
                                className="bg-[#003D1A] text-[#D4AF37] py-2 rounded font-bold hover:bg-[#0a5229] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSavingProfile
                                    ? "Saving..."
                                    : "Save Profile Updates"}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                    >
                        <h2 className="text-2xl text-[#D4AF37] mb-4">
                            Change Password
                        </h2>

                        <div className="flex flex-col gap-4">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={
                                    passwords.oldPassword
                                }
                                onChange={(event) =>
                                    setPasswords({
                                        ...passwords,
                                        oldPassword:
                                            event.target
                                                .value,
                                    })
                                }
                                className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                            />

                            <input
                                type="password"
                                placeholder="New Password"
                                value={
                                    passwords.newPassword
                                }
                                onChange={(event) =>
                                    setPasswords({
                                        ...passwords,
                                        newPassword:
                                            event.target
                                                .value,
                                    })
                                }
                                className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                            />

                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={
                                    passwords.confirmPassword
                                }
                                onChange={(event) =>
                                    setPasswords({
                                        ...passwords,
                                        confirmPassword:
                                            event.target
                                                .value,
                                    })
                                }
                                className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                            />

                            <button
                                type="button"
                                className="bg-[#003D1A] text-[#D4AF37] py-2 rounded font-bold hover:bg-[#0a5229] disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={
                                    handleUpdatePassword
                                }
                                disabled={
                                    isUpdatingPassword
                                }
                            >
                                {isUpdatingPassword
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.2,
                        }}
                    >
                        <h2 className="text-2xl text-[#D4AF37] mb-4">
                            Saved Address
                        </h2>

                        <textarea
                            name="streetAddress"
                            value={user.streetAddress}
                            onChange={
                                handleProfileChange
                            }
                            rows="3"
                            maxLength={255}
                            className="w-full bg-black border border-[#003D1A] rounded p-2 text-white resize-none"
                            placeholder="Enter your home address..."
                        />

                        <button
                            type="button"
                            onClick={
                                handleSaveProfile
                            }
                            disabled={
                                isSavingProfile
                            }
                            className="w-full bg-[#003D1A] text-[#D4AF37] py-2 rounded font-bold hover:bg-[#0a5229] mt-4 disabled:opacity-60"
                        >
                            Save Address
                        </button>
                    </motion.div>

                    <motion.div
                        className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.3,
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-[#D4AF37]">
                                Payment Methods
                            </h2>

                            <span className="text-sm text-gray-400">
                                {paymentCards.length} / 3
                                Cards
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 mb-4">
                            {paymentCards.map((card) => (
                                <div
                                    key={card.cardId}
                                    className="flex justify-between items-center bg-black p-3 rounded border border-[#003D1A]"
                                >
                                    <div className="text-white">
                                        <p>
                                            •••• •••• ••••{" "}
                                            {card.cardNumber?.slice(
                                                -4
                                            )}
                                        </p>

                                        <p className="text-sm text-gray-400">
                                            Exp:{" "}
                                            {
                                                card.expirationMonth
                                            }
                                            /
                                            {
                                                card.expirationYear
                                            }
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="text-[#D4AF37] hover:underline text-sm"
                                            onClick={() =>
                                                handleEditCard(
                                                    card
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteCard(
                                                    card.cardId
                                                )
                                            }
                                            className="text-red-400 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showCardForm && (
                            <div className="bg-black p-4 rounded border border-[#003D1A] mb-4">
                                <h3 className="text-[#D4AF37] font-bold mb-3">
                                    {editingCardId !==
                                    null
                                        ? "Edit Payment Method"
                                        : "Add Payment Method"}
                                </h3>

                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Cardholder Name"
                                        value={
                                            cardForm.cardholderName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCardForm(
                                                (
                                                    currentForm
                                                ) => ({
                                                    ...currentForm,
                                                    cardholderName:
                                                        event
                                                            .target
                                                            .value,
                                                })
                                            )
                                        }
                                        className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        value={
                                            cardForm.cardNumber
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCardForm(
                                                (
                                                    currentForm
                                                ) => ({
                                                    ...currentForm,
                                                    cardNumber:
                                                        event
                                                            .target
                                                            .value,
                                                })
                                            )
                                        }
                                        className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                    />

                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="Expiration Month"
                                            min="1"
                                            max="12"
                                            value={
                                                cardForm.expirationMonth
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCardForm(
                                                    (
                                                        currentForm
                                                    ) => ({
                                                        ...currentForm,
                                                        expirationMonth:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            className="w-1/2 bg-black border border-[#003D1A] rounded p-2 text-white"
                                        />

                                        <input
                                            type="number"
                                            placeholder="Expiration Year"
                                            value={
                                                cardForm.expirationYear
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCardForm(
                                                    (
                                                        currentForm
                                                    ) => ({
                                                        ...currentForm,
                                                        expirationYear:
                                                            event
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                            className="w-1/2 bg-black border border-[#003D1A] rounded p-2 text-white"
                                        />
                                    </div>

                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        value={
                                            cardForm.cvv
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCardForm(
                                                (
                                                    currentForm
                                                ) => ({
                                                    ...currentForm,
                                                    cvv: event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Billing ZIP"
                                        value={
                                            cardForm.billingZip
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCardForm(
                                                (
                                                    currentForm
                                                ) => ({
                                                    ...currentForm,
                                                    billingZip:
                                                        event
                                                            .target
                                                            .value,
                                                })
                                            )
                                        }
                                        className="w-full bg-black border border-[#003D1A] rounded p-2 text-white"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={
                                                handleSaveCard
                                            }
                                            className="bg-[#003D1A] text-[#D4AF37] px-4 py-2 rounded font-bold"
                                        >
                                            Save Card
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCardForm(
                                                    false
                                                );
                                                setEditingCardId(
                                                    null
                                                );
                                            }}
                                            className="text-gray-300 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleAddCard}
                            disabled={
                                paymentCards.length >= 3
                            }
                            className={`w-full py-2 rounded font-bold border ${
                                paymentCards.length >= 3
                                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                                    : "bg-transparent text-[#D4AF37] border-[#D4AF37] hover:bg-[#003D1A]"
                            }`}
                        >
                            {paymentCards.length >= 3
                                ? "Maximum Cards Reached"
                                : "+ Add New Card"}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
