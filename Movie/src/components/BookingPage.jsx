import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import { clearAuthState, loadAuthState } from "../utils/authStorage";
import AlertModal from "./AlertModal";
import LoginModal from "./LoginModal";
import ResetModal from "./ResetModal";

export default function BookingPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { movie, selectedShowtime } = state || {};
    
    const [adultTickets, setAdultTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [seniorTickets, setSeniorTickets] = useState(0);
    const [studentTickets, setStudentTickets] = useState(0);

    const [showSeating, setShowSeating] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [auth, setAuth] = useState(() => loadAuthState());
    const [alertMessage, setAlertMessage] = useState("");
    const [showLogIn, setShowLogIn] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [seatAvailability, setSeatAvailability] = useState([]);
    const [isLoadingSeats, setIsLoadingSeats] = useState(false);

    const tickets = [];

    const handleLoginSuccess = () => {
        setAuth(loadAuthState());
    };

    for (let i = 0; i < adultTickets; i++) {
        tickets.push({
            type: "Adult",
            price: 10
        });
    }

    for (let i = 0; i < childTickets; i++) {
        tickets.push({
            type: "Child",
            price: 5
        });
    }

    for (let i = 0; i < seniorTickets; i++) {
        tickets.push({
            type: "Senior",
            price: 7
        });
    }

    for (let i = 0; i < studentTickets; i++) {
        tickets.push({
            type: "Student",
            price: 0
        });
    }

    const totalTickets = adultTickets + childTickets + seniorTickets + studentTickets;
    const totalPrice = tickets.reduce(
        (sum, ticket) => sum + ticket.price,
        0
    );

    const handleSeatClick = (seatId) => {
        const seat = seatAvailability.find(
            (item) => item.seatLabel === seatId
        );

        const isBooked =
            seat?.booked ??
            seat?.reserved ??
            seat?.unavailable ??
            false;

        if (isBooked) {
            setAlertMessage(`${seatId} is already reserved.`);
            return;
        }

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats((currentSeats) =>
            currentSeats.filter((id) => id !== seatId)
            );
            return;
        }

        if (selectedSeats.length >= totalTickets) {
            setAlertMessage(
            `You selected ${totalTickets} ticket(s), so you can only choose ${totalTickets} seat(s).`
            );
            return;
        }

        setSelectedSeats((currentSeats) => [
            ...currentSeats,
            seatId,
        ]);
    };

    const handleCheckout = () => {
        setAlertMessage(`Success! You bought ${totalTickets} ticket(s) for ${movie?.movieTitle} at ${selectedShowtime?.showTime}. Seats: ${selectedSeats.join(', ')}`);
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

    useEffect(() => {
        const showtimeId =
            selectedShowtime?.showtimeId ??
            selectedShowtime?.showTimeId ??
            selectedShowtime?.id;

        if (!showtimeId) {
            console.error("No showtime ID found:", selectedShowtime);
            return;
        }

        const loadSeats = async () => {
            try {
            setIsLoadingSeats(true);

            const response = await fetch(
                `http://localhost:8080/api/showtimes/${showtimeId}/seats`
            );

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
                throw new Error(
                responseData?.message || "Unable to load seats."
                );
            }

            setSeatAvailability(
                Array.isArray(responseData) ? responseData : []
            );
            } catch (error) {
            console.error("Seat request failed:", error);
            setAlertMessage(error.message);
            } finally {
            setIsLoadingSeats(false);
            }
        };

        loadSeats();
    }, [selectedShowtime]);

    const seatsByRow = seatAvailability.reduce((groups, seat) => {
        const row = seat.seatLabel.charAt(0);

        if (!groups[row]) {
            groups[row] = [];
        }

        groups[row].push(seat);

        return groups;
    }, {});

    return(
        <div className="min-h-screen pb-20">
            <NavBar
                isLoggedIn={Boolean(auth.token)}
                onLogout={handleLogout}
                onLogIn={() => setShowLogIn(true)}
            />
            {showLogIn && (<LoginModal onClose={() => setShowLogIn(false)} onForgotPassword={() => {setShowLogIn(false); setShowResetModal(true);}} onLoginSuccess={handleLoginSuccess}/>) }
            {showResetModal && (<ResetModal onClose={() => setShowResetModal(false)}/>) }

            <div className="bg-[#000000] h-37.5 flex justify-evenly items-center text-white">
                <img className="h-30 rounded object-cover" src={movie?.trailerImage} alt={`${movie?.movieTitle} poster`} />
                <p className="text-2xl font-bold text-[#D4AF37]">{movie?.movieTitle || "Select a Movie"}</p>
                <p className="text-xl">{selectedShowtime?.showTime || "No time selected"}</p>
            </div>

            <div className="grid grid-cols-3 gap-10 p-10 max-w-4xl mx-auto text-xl">
                <p>Adult</p>
                <p> $10.00</p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => { setAdultTickets(prev => Math.max(0, prev - 1)); setSelectedSeats([]); }}>-</button>
                    <p>{adultTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => setAdultTickets(prev => prev + 1)}>+</button>
                </div>

                <div className="flex flex-col">
                    <p>Child</p>
                    <p className="text-xs text-gray-500"> 10 and under</p>
                </div>
                <p>$5.00</p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => { setChildTickets(prev => Math.max(0, prev - 1)); setSelectedSeats([]); }}>-</button>
                    <p>{childTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => setChildTickets(prev => prev + 1)}>+</button>
                </div>

                <div className="flex flex-col">
                    <p>Senior</p>
                    <p className="text-xs text-gray-500"> 65 and over</p>
                </div>
                <p> $7.00</p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => { setSeniorTickets(prev => Math.max(0, prev - 1)); setSelectedSeats([]); }}>-</button>
                    <p>{seniorTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => setSeniorTickets(prev => prev + 1)}>+</button>
                </div>
                
                <p>Student</p>
                <p> Free :) </p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => { setStudentTickets(prev => Math.max(0, prev - 1)); setSelectedSeats([]); }}>-</button>
                    <p>{studentTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] rounded-full flex justify-center items-center" onClick={() => setStudentTickets(prev => prev + 1)}>+</button>
                </div>
            </div>  

            {!showSeating && (
                <div className="flex justify-center items-center mt-6">
                    <button 
                        className="h-12.5 w-100 border border-[#D4AF37] bg-transparent text-[#D4AF37] rounded-[10px] hover:bg-[#003D1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setShowSeating(true)}
                        disabled={totalTickets === 0}
                    >
                        {totalTickets > 0 ? "Select your seats" : "Please add tickets first"}
                    </button>
                </div>  
            )}

            {showSeating && (
                <div className="max-w-3xl mx-auto mt-12 bg-[#121212] p-8 rounded-xl border border-[#003D1A]">
                    <h2 className="text-center text-[#D4AF37] text-2xl mb-6">
                    Screen
                    </h2>

                    <div className="w-full h-2 bg-gray-600 rounded-full mb-8" />

                    <div className="mb-8 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-t bg-[#003D1A]" />
                        <span>Available</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-t bg-[#D4AF37]" />
                        <span>Selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-t bg-gray-700 opacity-60" />
                        <span>Reserved</span>
                    </div>
                    </div>

                    {isLoadingSeats ? (
                    <p className="text-center text-gray-400">
                        Loading seats...
                    </p>
                    ) : seatAvailability.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No seats were returned for this showtime.
                    </p>
                    ) : (
                    <div className="flex flex-col gap-4 items-center">
                        {Object.entries(seatsByRow).map(([row, seats]) => (
                        <div key={row} className="flex gap-4 items-center">
                            <span className="text-[#D4AF37] w-6 text-center font-bold">
                            {row}
                            </span>

                            <div className="flex gap-2">
                            {seats.map((seat) => {
                                const seatId = seat.seatLabel;

                                const isBooked =
                                seat.booked ??
                                seat.reserved ??
                                seat.unavailable ??
                                false;

                                const isSelected =
                                selectedSeats.includes(seatId);

                                return (
                                <button
                                    key={seatId}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => handleSeatClick(seatId)}
                                    title={
                                    isBooked
                                        ? `${seatId} is reserved`
                                        : `${seatId} is available`
                                    }
                                    className={`w-10 h-10 rounded-t-lg transition-colors ${
                                    isBooked
                                        ? "bg-gray-700 text-gray-500 opacity-60 cursor-not-allowed"
                                        : isSelected
                                        ? "bg-[#D4AF37] text-black font-bold"
                                        : "bg-[#003D1A] text-gray-300 hover:bg-[#0a5229]"
                                    }`}
                                >
                                    {seatId.substring(1)}
                                </button>
                                );
                            })}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}

                    <div className="mt-10 border-t border-[#003D1A] pt-6 flex flex-col items-center">
                    <p className="text-lg mb-4">
                        Seats Selected:{" "}
                        <span className="text-[#D4AF37] font-bold">
                        {selectedSeats.length} / {totalTickets}
                        </span>
                    </p>

                    <p className="text-md text-gray-400 mb-6 min-h-6">
                        {selectedSeats.length > 0
                        ? `Your seats: ${selectedSeats.join(", ")}`
                        : "Click on the map to choose your seats."}
                    </p>

                    <button
                        type="button"
                        className="bg-[#003D1A] text-[#D4AF37] border border-[#D4AF37] py-3 px-12 rounded-xl font-bold text-xl hover:bg-[#0a5229] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedSeats.length !== totalTickets}
                        onClick={() => {
                        navigate("/checkout", {
                            state: {
                            movie,
                            selectedShowtime,
                            selectedSeats,
                            totalTickets,
                            totalPrice,
                            tickets,
                            },
                        });
                        }}
                    >
                        Proceed to Checkout
                    </button>
                    </div>
                </div>
            )}

            {alertMessage && (
              <AlertModal
                message={alertMessage}
                onClose={() => setAlertMessage("")}
              />
            )}
          </div>
        );
}