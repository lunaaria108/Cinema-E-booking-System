import { useLocation } from "react-router-dom";
import { useState } from "react";
import NavBar from './NavBar';

export default function BookingPage() {
    const { state } = useLocation();
    const { movie, selectedShowtime } = state || {};
    
    const [adultTickets, setAdultTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [seniorTickets, setSeniorTickets] = useState(0);
    const [studentTickets, setStudentTickets] = useState(0);

    const [showSeating, setShowSeating] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const totalTickets = adultTickets + childTickets + seniorTickets + studentTickets;

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;

    const handleSeatClick = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length < totalTickets) {
                setSelectedSeats([...selectedSeats, seatId]);
            } else {
                alert(`You have only selected ${totalTickets} ticket(s). Increase your ticket count to select more seats.`);
            }
        }
    };

    const handleCheckout = () => {
        alert(`Success! You bought ${totalTickets} ticket(s) for ${movie?.movieTitle} at ${selectedShowtime?.showTime}. Seats: ${selectedSeats.join(', ')}`);
    };

    return(
        <div className="min-h-screen pb-20">
            <NavBar booking={true}/>

            <div className="bg-[#000000] h-[150px] flex justify-evenly items-center text-white">
                <img className="h-[120px] rounded object-cover" src={movie?.trailerImage} alt={`${movie?.movieTitle} poster`} />
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
                        className="h-[50px] w-[400px] border border-[#D4AF37] bg-transparent text-[#D4AF37] rounded-[10px] hover:bg-[#003D1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setShowSeating(true)}
                        disabled={totalTickets === 0}
                    >
                        {totalTickets > 0 ? "Select your seats" : "Please add tickets first"}
                    </button>
                </div>  
            )}

            {showSeating && (
                <div className="max-w-2xl mx-auto mt-12 bg-[#121212] p-8 rounded-xl border border-[#003D1A]">
                    <h2 className="text-center text-[#D4AF37] text-2xl mb-6">Screen</h2>
                    <div className="w-full h-2 bg-gray-600 rounded-full mb-10 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"></div>

                    <div className="flex flex-col gap-4 items-center">
                        {rows.map((row) => (
                            <div key={row} className="flex gap-4 items-center">
                                <span className="text-[#D4AF37] w-6 text-center font-bold">{row}</span>
                                <div className="flex gap-2">
                                    {Array.from({ length: seatsPerRow }).map((_, index) => {
                                        const seatId = `${row}${index + 1}`;
                                        const isSelected = selectedSeats.includes(seatId);
                                        return (
                                            <button
                                                key={seatId}
                                                onClick={() => handleSeatClick(seatId)}
                                                className={`w-10 h-10 rounded-t-lg transition-colors ${
                                                    isSelected 
                                                    ? 'bg-[#D4AF37] text-black font-bold' 
                                                    : 'bg-[#003D1A] text-gray-300 hover:bg-[#0a5229]'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 border-t border-[#003D1A] pt-6 flex flex-col items-center">
                        <p className="text-lg mb-4">
                            Seats Selected: <span className="text-[#D4AF37] font-bold">{selectedSeats.length} / {totalTickets}</span>
                        </p>
                        <p className="text-md text-gray-400 mb-6 min-h-[24px]">
                            {selectedSeats.length > 0 ? `Your seats: ${selectedSeats.join(', ')}` : "Click on the map to choose your seats."}
                        </p>
                        
                        <button 
                            className="bg-[#003D1A] text-[#D4AF37] border border-[#D4AF37] py-3 px-12 rounded-xl font-bold text-xl hover:bg-[#0a5229] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedSeats.length !== totalTickets}
                            onClick={handleCheckout}
                        >
                            Buy Tickets
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}