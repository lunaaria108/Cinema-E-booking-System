import NavBar from "./NavBar";
import AlertModal from "./AlertModal";
import logo from "../assets/logo.jpg";

import {
    clearAuthState,
    loadAuthState,
} from "../utils/authStorage";

import { useState } from "react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [auth, setAuth] = useState(() =>
        loadAuthState()
    );

    const {
        movie,
        selectedShowtime,
        selectedSeats = [],
        totalTickets = 0,
        totalPrice = 0,
        tickets = [],
    } = location.state || {};

    const [alertMessage, setAlertMessage] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("saved");

    const [selectedCardId, setSelectedCardId] =
        useState("1");

    const [promotionCode, setPromotionCode] =
        useState("");

    const [appliedPromotion, setAppliedPromotion] =
        useState(null);

    const [paymentForm, setPaymentForm] = useState({
        cardholderName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvv: "",
        billingZip: "",
        saveCard: false,
    });

    /*
     * Mock saved cards.
     * These are displayed without contacting the backend.
     */
    const savedCards = [
        {
            cardId: "1",
            cardType: "Visa",
            lastFour: "4242",
            expirationMonth: "08",
            expirationYear: "2028",
            cardholderName: "John Smith",
        },
        {
            cardId: "2",
            cardType: "Mastercard",
            lastFour: "5555",
            expirationMonth: "04",
            expirationYear: "2029",
            cardholderName: "John Smith",
        },
    ];

    const subtotal = Number(totalPrice) || 0;

    /*
     * SAVE10 is the mock promotion.
     */
    const discountAmount = appliedPromotion
        ? subtotal * 0.1
        : 0;

    const finalTotal = Math.max(
        0,
        subtotal - discountAmount
    );

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setPaymentForm((currentForm) => ({
            ...currentForm,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleCardNumberChange = (event) => {
        const digitsOnly =
            event.target.value.replace(/\D/g, "");

        const formattedNumber = digitsOnly
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();

        setPaymentForm((currentForm) => ({
            ...currentForm,
            cardNumber: formattedNumber,
        }));
    };

    const handleApplyPromotion = () => {
        const cleanedCode =
            promotionCode.trim().toUpperCase();

        if (!cleanedCode) {
            setAlertMessage(
                "Please enter a promotion code."
            );
            return;
        }

        if (cleanedCode !== "SAVE10") {
            setAppliedPromotion(null);
            setAlertMessage(
                "Invalid promotion code. Try SAVE10."
            );
            return;
        }

        setPromotionCode(cleanedCode);

        setAppliedPromotion({
            code: "SAVE10",
            discountPercent: 10,
        });

        setAlertMessage(
            "Promotion applied successfully."
        );
    };

    const handleRemovePromotion = () => {
        setAppliedPromotion(null);
        setPromotionCode("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            paymentMethod === "saved" &&
            !selectedCardId
        ) {
            setAlertMessage(
                "Please select a saved card."
            );
            return;
        }

        if (paymentMethod === "new") {
            if (
                !paymentForm.cardholderName ||
                !paymentForm.cardNumber ||
                !paymentForm.expirationMonth ||
                !paymentForm.expirationYear ||
                !paymentForm.cvv ||
                !paymentForm.billingZip
            ) {
                setAlertMessage(
                    "Please complete the new card form."
                );
                return;
            }
        }

        /*
         * Mock payment only.
         * No request is sent to the backend.
         */
        setAlertMessage(
            `Mock payment of $${finalTotal.toFixed(
                2
            )} completed successfully.`
        );
    };

    const handleLogout = () => {
        clearAuthState();
        setAuth(loadAuthState());
        navigate("/");
    };

    return (
        <>
            <NavBar
                booking={true}
                isLoggedIn={Boolean(auth.token)}
                onLogout={handleLogout}
            />

            <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4 py-10">
                <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37] bg-black/90 p-8 shadow-xl">
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={logo}
                            alt="Cinema logo"
                            className="h-16 w-16"
                        />

                        <h1 className="text-2xl font-bold text-white">
                            Payment Information
                        </h1>

                        {movie && (
                            <p className="text-gray-300">
                                {movie.title}
                            </p>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-5 flex flex-col gap-8"
                    >
                        {/* Payment method */}
                        <section>
                            <h2 className="m-5 text-xl font-bold text-white">
                                Payment Method
                            </h2>

                            <div className="flex justify-center gap-5 mt-7">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("saved")}
                                    className={`
                                        rounded-full
                                        border
                                        px-8
                                        py-4
                                        text-xl
                                        font-semibold
                                        transition-all
                                        ${
                                            paymentMethod === "saved"
                                                ? "border-[#D4AF37] bg-[#003D1A] text-[#D4AF37]"
                                                : "border-[#315c40] bg-transparent text-white hover:border-[#D4AF37]"
                                        }
                                    `}
                                >
                                    Saved Card
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("new")}
                                    className={`
                                        rounded-full
                                        border
                                        px-8
                                        py-4
                                        text-xl
                                        font-semibold
                                        transition-all
                                        ${
                                            paymentMethod === "new"
                                                ? "border-[#D4AF37] bg-[#003D1A] text-[#D4AF37]"
                                                : "border-[#315c40] bg-transparent text-white hover:border-[#D4AF37]"
                                        }
                                    `}
                                >
                                    New Card
                                </button>
                            </div>
                        </section>

                        {/* Saved cards */}
                        {paymentMethod === "saved" && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-lg font-bold text-[#D4AF37]">
                                    Select a Saved Card
                                </h2>

                                {savedCards.map((card) => {
                                    const selected =
                                        selectedCardId ===
                                        card.cardId;

                                    return (
                                        <label
                                            key={
                                                card.cardId
                                            }
                                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${
                                                selected
                                                    ? "border-[#D4AF37] bg-[#003D1A]"
                                                    : "border-[#4c6d51] bg-[#0b0b0b]"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="savedCard"
                                                    value={
                                                        card.cardId
                                                    }
                                                    checked={
                                                        selected
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setSelectedCardId(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className="accent-[#D4AF37]"
                                                />

                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {
                                                            card.cardType
                                                        }{" "}
                                                        ending
                                                        in{" "}
                                                        {
                                                            card.lastFour
                                                        }
                                                    </p>

                                                    <p className="text-sm text-gray-400">
                                                        Expires{" "}
                                                        {
                                                            card.expirationMonth
                                                        }
                                                        /
                                                        {
                                                            card.expirationYear
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-300">
                                                {
                                                    card.cardholderName
                                                }
                                            </p>
                                        </label>
                                    );
                                })}
                            </section>
                        )}

                        {/* New card */}
                        {paymentMethod === "new" && (
                            <section className="flex flex-col gap-6">
                                <h2 className="text-lg font-bold text-[#D4AF37]">
                                    Enter a New Card
                                </h2>

                                <FormRow
                                    label="Name on Card:"
                                    htmlFor="cardholderName"
                                >
                                    <input
                                        type="text"
                                        id="cardholderName"
                                        name="cardholderName"
                                        value={
                                            paymentForm.cardholderName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={inputStyle}
                                    />
                                </FormRow>

                                <FormRow
                                    label="Card Number:"
                                    htmlFor="cardNumber"
                                >
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={
                                            paymentForm.cardNumber
                                        }
                                        onChange={
                                            handleCardNumberChange
                                        }
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        className={inputStyle}
                                    />
                                </FormRow>

                                <FormRow label="Expiration:">
                                    <div className="flex flex-1 gap-3">
                                        <input
                                            type="number"
                                            name="expirationMonth"
                                            value={
                                                paymentForm.expirationMonth
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="MM"
                                            min="1"
                                            max="12"
                                            className={inputStyle}
                                        />

                                        <input
                                            type="number"
                                            name="expirationYear"
                                            value={
                                                paymentForm.expirationYear
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="YYYY"
                                            className={inputStyle}
                                        />
                                    </div>
                                </FormRow>

                                <FormRow
                                    label="CVV:"
                                    htmlFor="cvv"
                                >
                                    <input
                                        type="password"
                                        id="cvv"
                                        name="cvv"
                                        value={
                                            paymentForm.cvv
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={4}
                                        className={inputStyle}
                                    />
                                </FormRow>

                                <FormRow
                                    label="Billing ZIP:"
                                    htmlFor="billingZip"
                                >
                                    <input
                                        type="text"
                                        id="billingZip"
                                        name="billingZip"
                                        value={
                                            paymentForm.billingZip
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={10}
                                        className={inputStyle}
                                    />
                                </FormRow>

                                <label className="flex items-center gap-3 text-[#D4AF37]">
                                    <input
                                        type="checkbox"
                                        name="saveCard"
                                        checked={
                                            paymentForm.saveCard
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="accent-[#003D1A]"
                                    />

                                    Save this card for future
                                    purchases
                                </label>
                            </section>
                        )}

                        {/* Promotion */}
                        <section className="border-t border-[#4c6d51] pt-6">
                            <h2 className="mb-4 text-lg font-bold text-[#D4AF37]">
                                Promotion
                            </h2>

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={
                                        promotionCode
                                    }
                                    onChange={(event) =>
                                        setPromotionCode(
                                            event.target.value.toUpperCase()
                                        )
                                    }
                                    disabled={Boolean(
                                        appliedPromotion
                                    )}
                                    placeholder="Try SAVE10"
                                    className={inputStyle}
                                />

                                {!appliedPromotion ? (
                                    <button
                                        type="button"
                                        onClick={
                                            handleApplyPromotion
                                        }
                                        className="rounded-md border border-[#D4AF37] bg-[#003D1A] px-5 py-2 text-[#D4AF37] hover:bg-[#0a5229]"
                                    >
                                        Apply
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={
                                            handleRemovePromotion
                                        }
                                        className="rounded-md border border-red-500 px-5 py-2 text-red-400"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Totals */}
                        <section className="flex flex-col gap-3 border-t border-[#4c6d51] pt-6 text-white">
                            <div className="flex justify-between">
                                <span>Tickets:</span>
                                <span>
                                    {totalTickets}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>
                                    $
                                    {subtotal.toFixed(
                                        2
                                    )}
                                </span>
                            </div>

                            {appliedPromotion && (
                                <div className="flex justify-between text-green-400">
                                    <span>
                                        SAVE10 discount:
                                    </span>

                                    <span>
                                        -$
                                        {discountAmount.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between border-t border-[#4c6d51] pt-3 text-xl font-bold text-[#D4AF37]">
                                <span>Total:</span>

                                <span>
                                    $
                                    {finalTotal.toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        </section>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="rounded-lg border border-[#D4AF37] bg-[#003D1A] px-8 py-3 font-bold text-[#D4AF37] hover:bg-[#0a5229]"
                            >
                                Pay $
                                {finalTotal.toFixed(2)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {alertMessage && (
                <AlertModal
                    message={alertMessage}
                    onClose={() =>
                        setAlertMessage("")
                    }
                />
            )}
        </>
    );
}

const inputStyle =
    "flex-1 bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-3 py-2 text-white";

function FormRow({
    label,
    htmlFor,
    children,
}) {
    return (
        <div className="flex items-center">
            <label
                htmlFor={htmlFor}
                className="w-36 shrink-0 text-left text-[#D4AF37]"
            >
                {label}
            </label>

            {children}
        </div>
    );
}