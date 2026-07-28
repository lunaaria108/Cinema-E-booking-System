import NavBar from "./NavBar";
import { clearAuthState, loadAuthState } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";

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
    const checkoutState = {
        movie,
        selectedShowtime,
        selectedSeats,
        totalTickets,
        totalPrice,
        tickets,
    };

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
                    `http://localhost:8080/api/users/${auth.userId}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Unable to load user: ${response.status}`
                    );
                }

                const data = await response.json();

                setUser({
                    email: data.email || "",
                });
            } catch (error) {
                console.error("Unable to load user:", error);
            }
        };

        loadUser();
    }, [auth.userId]);

    useEffect(() => {
        if (!auth.token) {
            setShowLoginModal(true);
        }
    }, [auth.token]);

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
                        <p className="text-3xl">Order Summary</p>
                        <p>{movie?.movieTitle}</p>
                        <p>{selectedShowtime?.showTime}</p>
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
                    
                    <div>
                        <p>Email: {user.email || "No email found"}</p>
                        <button
                                type="button"
                                className="text-[#D4AF37] hover:underline mt-2"
                                onClick={() => {
                                    navigate("/profile")
                                }}
                            >
                                Update Email
                            </button>
                    </div>

                    <button
                    onClick={() => 
                        navigate("/payment", {
                            state: {
                                movie,
                                selectedShowtime,
                                selectedSeats,
                                totalTickets,
                                totalPrice,
                                tickets,
                            },
                        })
                    }
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
                        // open your reset modal here
                    }}
                />
            )}
        </div>
    );    
}