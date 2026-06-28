import search from "../assets/search.png";

export default function SearchBar() {
    return (
        <div className="bg-white h-[40px] w-[400px] rounded-3xl flex justify-start items-center p-4">
            <img src={search} alt="Search" className="h-6 w-6 mr-2" />
            <p className="text-gray-500">Search for a movie...</p>
        </div>
    );
}