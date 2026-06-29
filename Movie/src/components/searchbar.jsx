import search from "../assets/search.png";
import { useState } from "react";

export default function SearchBar({ onSearch}) {
    const [searchTerm, setSearchTerm] = useState("");

    const clearsearch = () => {
        setSearchTerm("");
        onSearch(""); 
    };

    return (
        <div className=" bg-white h-[40px] w-[400px] rounded-3xl flex justify-start items-center p-4">
            <img src={search} alt="Search" className="h-6 w-6 mr-2" />
            <input className="text-gray-500"
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    onSearch(e.target.value)
                }}          
            /> 

            {searchTerm && (
                <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={clearsearch}>
                    X
                </button>
            )}

        </div>
    );
}