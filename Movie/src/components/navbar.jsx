import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import SearchBar from "./SearchBar";

export default function NavBar({
    booking = false, 
    onSearch = () => {}, 
    onFilter = () => {}, 
    isFiltered = false, 
    onBrowseMovies = () => {},
    isLoggedIn = false, 
    isAdmin = false, 
    isSignUpPage = false,
    onLogIn = () => {},
    onLogout = () => {}
}) {
    const navigate = useNavigate();
    
    return(
        <div className="bg-[radial-gradient(circle_at_top_right,#003D1A_0%,#000000_30%)]">
            <div className="flex justify-between items-center p-4"> 
                
                <div className="flex justify-start items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" className="h-16 w-16" />
                    <p className="ml-4 font-bebas text-[#D8CC88] text-2xl font-bold">Cinema Booking Service</p>
                </div>

                <div className="flex justify-start items-center gap-4">
                    {booking && (
                        <button className="text-[#D8CC88] hover:underline" onClick={() => navigate("/")}>
                            Browse Movies
                        </button>
                    )}
                    {!booking && (
                       <button className="text-[#D8CC88] hover:underline" onClick={onFilter}>
                            Filter
                        </button>
                    )}
                    {isFiltered && (
                        <button className="text-[#D8CC88] hover:underline" onClick={onBrowseMovies}>
                            Browse Movies
                        </button>
                    )}
                    
                    <SearchBar onSearch={onSearch} />

                    <div className="flex items-center gap-4 border-l border-[#003D1A] pl-4 ml-2">
                        {isLoggedIn ? (
                            <>
                                {isAdmin && (
                                    <button className="text-[#D4AF37] hover:text-white transition-colors" onClick={() => navigate("/admin")}>
                                        Admin
                                    </button>
                                )}
                                <button className="text-[#D4AF37] hover:text-white transition-colors" onClick={() => navigate("/profile")}>
                                    Profile
                                </button>
                                <button className="text-red-400 hover:text-red-300 transition-colors" onClick={onLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="text-[#D4AF37] hover:text-white transition-colors" onClick={onLogIn}>
                                    Log In
                                </button>
                                {!isSignUpPage && (
                                    <button className="bg-[#003D1A] text-[#D4AF37] px-4 py-1.5 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229] transition-colors"
                                     onClick={() => navigate("/signup")}>
                                        Sign Up
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>       
    );
}