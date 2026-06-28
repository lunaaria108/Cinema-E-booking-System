import logo from "../assets/logo.jpg";
import SearchBar from "./SearchBar";

export default function NavBar() {
    return(
        <div className="bg-[radial-gradient(circle_at_top_right,#003D1A_0%,#000000_30%)]">
            <div className="flex justify-between items-center p-4"> 
                <div className="flex justify-start items-center gap-4">
                    <img src={logo} alt="Logo" className="h-16 w-16" />
                    <p className="ml-4 font-ojuju text-[#D8CC88] text-2xl font-bold">Cinema Booking Service</p>
                </div>
                <div>
                    <SearchBar />
                </div>
            </div>
        </div>       
    );
}