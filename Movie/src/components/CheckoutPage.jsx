import NavBar from "./NavBar";
import { clearAuthState, loadAuthState } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import AlertModal from "./AlertModal";
import ReceiptEmailModal from "./ReceiptEmailModal";
import logo from "../assets/logo.jpg";

export default function CheckoutPage(){
    const location = useLocation();
    const { movie,
    selectedShowtime,
    selectedSeats = [],
    totalTickets = 0,
    totalPrice = 0,
    tickets = [],
    } = location.state || {};
    const [auth, setAuth] = useState(() => loadAuthState());
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const checkoutState = {
        movie,
        selectedShowtime,
        selectedSeats,
        totalTickets,
        totalPrice,
        tickets,
    };
    const [showReceiptEmailModal, setShowReceiptEmailModal] = useState(false);

    const [receiptEmail, setReceiptEmail] = useState("");

    const handleLogout = async () => {
        if (auth.token) {
            try {
                await fetch('http://localhost:8080/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: auth.token }),
                });
            } catch (error) {
                console.error('Logout request failed:', error);
            }
        }

        clearAuthState();
        setAuth(loadAuthState());
        navigate('/');
    };

    const handleLoginSuccess = (authData) => {
        setAuth(authData);
        setShowLoginModal(false);
    };

    const handleProceedToPayment = async () => {
        if (!auth.token) {
            setShowLoginModal(true);
            return;
        }

        try {
            const checkoutPayload = {
                userId: auth.userId,
                showtimeId: selectedShowtime.showtimeId,
                seats: selectedSeats.map((seat, index) => ({
                    seatLabel:
                        typeof seat === "object"
                            ? seat.seatLabel
                            : seat,

                    ticketType:
                        tickets[index]?.type,
                })),
            };

            const response = await fetch(
                "http://localhost:8080/api/checkout/confirm",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${auth.token}`,
                    },
                    body: JSON.stringify(checkoutPayload),
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
                throw new Error(
                    responseData?.message ||
                        "Unable to create booking."
                );
            }

            navigate("/payment", {
                state: {
                    bookingId: responseData.bookingId,
                    movie,
                    selectedShowtime,
                    selectedSeats,
                    totalTickets,
                    totalPrice: responseData.totalPrice,
                    tickets,
                },
            });
        } catch (error) {
            console.error(
                "Unable to confirm checkout:",
                error
            );

            setAlertMessage(
                error.message ||
                    "Unable to confirm checkout."
            );
        }
    };

    useEffect(() => {
        const checkoutState = {
            movie,
            selectedShowtime,
            selectedSeats,
            totalTickets,
            totalPrice,
            tickets,
        };

        if (movie && selectedShowtime && selectedSeats.length > 0) {
            sessionStorage.setItem(
                "pendingCheckout",
                JSON.stringify(checkoutState)
            );
        }
    }, [
        movie,
        selectedShowtime,
        selectedSeats,
        totalTickets,
        totalPrice,
        tickets,
    ]);

    useEffect(() => {
        if (!auth.userId) {
            return;
        }

        const loadUser = async () => {
            try {
               const response = await fetch(
                    `http://localhost:8080/api/users/${auth.userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${auth.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Unable to load user: ${response.status}`
                    );
                }

                const data = await response.json();

                const loadedEmail = data.email || "";

                setUser({
                    email: loadedEmail,
                });

                setReceiptEmail(loadedEmail);
            } catch (error) {
                console.error("Unable to load user:", error);
            }
        };

        loadUser();
    }, [auth.userId]);

    return(
        <div className="min-h-screen bg-[#0b0b0b] text-white">
            <NavBar
                isLoggedIn={Boolean(auth.token)}
                onLogout={handleLogout}
            />

            <div className="bg-[#000000] h-37.5 flex justify-evenly items-center text-white">
                <img className="h-30 rounded object-cover" src={movie?.trailerImage} alt={`${movie?.movieTitle} poster`} />
                <p className="text-2xl font-bold text-[#D4AF37]">{movie?.movieTitle || "Select a Movie"}</p>
                <p className="text-xl">{selectedShowtime?.showTime || "No time selected"}</p>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-lg min-h-150 rounded-3xl border border-[#D4AF37]
                bg-black/90 p-8 shadow-xl flex justify-center items-center flex-col mt-10 mb-10">
                    <div className="flex flex-col items-center gap-4 m-6 text-xl">
                        <img src={logo} alt="Logo" className="h-16 w-16"/>
                        <p className="text-3xl">Order Summary</p>
                        <p>Seats: {selectedSeats?.join(", ") || "None"}</p>
                        <p>Total Tickets: {totalTickets}</p>

                        <div className="w-full max-w-sm">
                            {tickets.map((ticket, index) => (
                                <div
                                    key={index}
                                    className="flex justify-evenly"
                                >
                                    <p>{ticket.type}</p>
                                    <p>${ticket.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <p className="font-bold">Total Price: ${Number(totalPrice).toFixed(2)}</p>
                    </div>
                    
                    <div className="text-center">
                        <p className="mb-5">Send receipt to:</p>

                        <p>
                            Email: {receiptEmail || "No email found"}
                        </p>

                        <button
                            type="button"
                            className="text-[#D4AF37] hover:underline mt-2"
                            onClick={() => setShowReceiptEmailModal(true)}
                        >
                            Use a different email
                        </button>

                        {receiptEmail &&
                            user.email &&
                            receiptEmail !== user.email && (
                                <button
                                    type="button"
                                    className="block mx-auto text-sm text-gray-400 hover:text-white hover:underline mt-2"
                                    onClick={() => setReceiptEmail(user.email)}
                                >
                                    Use account email
                                </button>
                            )}
                    </div>

                    <button
                    onClick={handleProceedToPayment}
                    className="bg-[#003D1A] text-[#D4AF37] border border-[#D4AF37] py-3 px-12 rounded-xl font-bold 
                    text-xl hover:bg-[#0a5229] transition-colors disabled:opacity-50 disabled:cursor-not-allowed m-6"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onForgotPassword={() => {
                        setShowLoginModal(false);
                    }}
                />
            )}

            {alertMessage && (
                <AlertModal
                    message={alertMessage}
                    onClose={() => setAlertMessage("")}
                />
            )}

            {showReceiptEmailModal && (
                <ReceiptEmailModal
                    currentEmail={receiptEmail}
                    onClose={() =>
                        setShowReceiptEmailModal(false)
                    }
                    onSave={(newEmail) => {
                        setReceiptEmail(newEmail);
                        setAlertMessage(
                            "Receipt email updated for this order."
                        );
                    }}
                />
            )}
        </div>
    );    
}
