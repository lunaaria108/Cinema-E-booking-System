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

    return(
        <div>
            <NavBar booking={true}/>

            <div className="bg-[#000000] h-[150px] flex justify-evenly items-center text-white">
                <img className="movie poster" src={movie?.poster} alt={`${movie?.title} poster`} />
                <p>{movie?.title}</p>
                <p>{selectedShowtime}</p>
            </div>

            <div className="grid grid-cols-3 gap-10 p-20 text-2xl">
                <p>Adult</p>
                <p> $10.00</p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => setAdultTickets(prev => Math.max(0, prev - 1))}>
                        -
                    </button>
                    <p>{adultTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => { console.log("plus clicked"), setAdultTickets(prev => prev + 1)}}>
                        +
                    </button>
                </div>

                <div className="flex flex-col">
                    <p>Child</p>
                    <p className="text-xs text-gray-500"> 10 and under</p>
                </div>
                <p>$5.00</p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => setChildTickets(prev => Math.max(0, prev - 1))}>
                        -
                    </button>
                    <p>{childTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => { console.log("plus clicked"), setChildTickets(prev => prev + 1)}}>
                        +
                    </button>
                </div>

                <div className="flex flex-col">
                    <p>Senior</p>
                    <p className="text-xs text-gray-500"> 65 and over</p>
                </div>
                <p> $7.00</p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => setSeniorTickets(prev => Math.max(0, prev - 1))}>
                        -
                    </button>
                    <p>{seniorTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => { console.log("plus clicked"), setSeniorTickets(prev => prev + 1)}}>
                        +
                    </button>
                </div>
                
                <p>Student</p>
                <p> Free :) </p>
                <div className="flex justify-evenly items-center">
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => setStudentTickets(prev => Math.max(0, prev - 1))}>
                        -
                    </button>
                    <p>{studentTickets}</p>
                    <button className="h-7 w-7 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#003D1A] 
                    rounded-full flex justify-center items-center" onClick={() => { console.log("plus clicked"), setStudentTickets(prev => prev + 1)}}>
                        +
                    </button>
                </div>
            </div>  

            <div className="flex justify-center items-center">
                <button className="h-[50px] w-[400px] border border-[#D4AF37] bg-transparent text-[#D4AF37] m-10 rounded-[10px] 
                hover:bg-[#003D1A] flex justify-center items-center hover:text-[#D4AF37]">
                    Select your seats
                </button>
            </div>  
        </div>
    );
};