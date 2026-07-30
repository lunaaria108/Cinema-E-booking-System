import NavBar from "./NavBar";
import AlertModal from "./AlertModal";
import logo from "../assets/logo.jpg";
import { clearAuthState, loadAuthState } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [auth, setAuth] = useState(() =>
        loadAuthState()
    );

    const {
        bookingId,
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
        useState("");

    const [paymentForm, setPaymentForm] = useState({
        cardholderName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvv: "",
        billingZip: "",
        saveCard: false,
    });

    const [savedCards, setSavedCards] = useState([]);

    const [isLoadingCards, setIsLoadingCards] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = Number(totalPrice) || 0;

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!bookingId) {
            setAlertMessage(
                "No booking was found for this payment."
            );
            return;
        }

        if (!auth.userId || !auth.token) {
            setAlertMessage(
                "You must be logged in to complete payment."
            );
            return;
        }

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
                !paymentForm.cardholderName.trim() ||
                !paymentForm.cardNumber ||
                !paymentForm.expirationMonth ||
                !paymentForm.expirationYear ||
                !paymentForm.cvv
            ) {
                setAlertMessage(
                    "Please complete the new card form."
                );
                return;
            }

            if (
                paymentForm.saveCard &&
                !paymentForm.billingZip.trim()
            ) {
                setAlertMessage(
                    "Please enter a billing ZIP to save this card."
                );
                return;
            }
        }

        try {
            setIsSubmitting(true);

            const paymentPayload =
                paymentMethod === "saved"
                    ? {
                        cardId: Number(selectedCardId),
                    }
                    : {
                        cardholderName:
                            paymentForm.cardholderName.trim(),

                        cardNumber:
                            paymentForm.cardNumber.replace(
                                /\s/g,
                                ""
                            ),

                        expirationMonth: Number(
                            paymentForm.expirationMonth
                        ),

                        expirationYear: Number(
                            paymentForm.expirationYear
                        ),

                        cvv: paymentForm.cvv,
                    };

            const response = await fetch(
                `http://localhost:8080/api/payments/${bookingId}/pay`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${auth.token}`,
                    },

                    body: JSON.stringify(paymentPayload),
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
                throw new Error(
                    responseData?.message ||
                        responseData?.paymentStatus ||
                        "Payment was declined."
                );
            }

            if (
                paymentMethod === "new" &&
                paymentForm.saveCard
            ) {
                const saveCardResponse = await fetch(
                    `http://localhost:8080/api/users/${auth.userId}/cards`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${auth.token}`,
                        },
                        body: JSON.stringify({
                            cardholderName: paymentForm.cardholderName.trim(),
                            cardNumber: paymentForm.cardNumber.replace(/\s/g, ""),
                            expirationMonth: Number(paymentForm.expirationMonth),
                            expirationYear: Number(paymentForm.expirationYear),
                            cvv: paymentForm.cvv,
                            billingZip: paymentForm.billingZip.trim(),
                        }),
                    }
                );

                if (!saveCardResponse.ok) {
                    console.error(
                        "Payment succeeded, but the card could not be saved."
                    );
                }
            }

            sessionStorage.removeItem(
                "pendingCheckout"
            );

            setAlertMessage("Payment successful!");
        } catch (error) {
            console.error("Payment failed:", error);

            setAlertMessage(
                error.message ||
                    "Unable to process payment."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        clearAuthState();
        setAuth(loadAuthState());
        navigate("/");
    };

    useEffect(() => {
        if (!auth.userId || !auth.token) {
            setSavedCards([]);
            setIsLoadingCards(false);
            return;
        }

        const loadSavedCards = async () => {
            try {
                setIsLoadingCards(true);

                const response = await fetch(
                    `http://localhost:8080/api/users/${auth.userId}/cards`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    }
                );

                const responseText = await response.text();

                let data = [];

                if (responseText) {
                    try {
                        data = JSON.parse(responseText);
                    } catch {
                        throw new Error(responseText);
                    }
                }

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        `Unable to load cards: ${response.status}`
                    );
                }

                const cards = Array.isArray(data) ? data : [];

                setSavedCards(cards);

                if (cards.length > 0) {
                    setSelectedCardId(
                        String(cards[0].cardId)
                    );
                } else {
                    setSelectedCardId("");
                    setPaymentMethod("new");
                }
            } catch (error) {
                console.error(
                    "Unable to load saved cards:",
                    error
                );

                setSavedCards([]);

                setAlertMessage(
                    error.message ||
                    "Unable to load your saved payment methods."
                );
            } finally {
                setIsLoadingCards(false);
            }
        };

        loadSavedCards();
    }, [auth.userId, auth.token]);

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
                                {movie.movieTitle}
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

                                {isLoadingCards ? (
                                    <p className="text-gray-300">
                                        Loading saved cards...
                                    </p>
                                ) : savedCards.length === 0 ? (
                                    <p className="text-gray-300">
                                        You do not have any saved cards.
                                    </p>
                                ) : (
                                    savedCards.map((card) => {
                                        const selected =
                                            selectedCardId === String(card.cardId);

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
                                                            Card ending in {card.lastFour}
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
                                    })
                                )}
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
                                        value={paymentForm.billingZip}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={inputStyle}
                                    />
                                </FormRow>

                                <label className="flex items-center gap-3 text-[#D4AF37]">
                                    <input
                                        type="checkbox"
                                        name="saveCard"
                                        checked={paymentForm.saveCard}
                                        onChange={handleChange}
                                        className="accent-[#003D1A]"
                                    />

                                    Save this card for future purchases
                                </label>
                            </section>
                        )}

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

                            <div className="flex justify-between border-t border-[#4c6d51] pt-3 text-xl font-bold text-[#D4AF37]">
                                <span>Total:</span>

                                <span>
                                    $
                                    {subtotal.toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        </section>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg border border-[#D4AF37]
                                bg-[#003D1A] px-8 py-3 font-bold
                                text-[#D4AF37] hover:bg-[#0a5229]
                                disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : `Pay $${subtotal.toFixed(2)}`}
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