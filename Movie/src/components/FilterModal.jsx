import { useState } from 'react';

export default function FilterModal({ onClose, onApplyFilter }) {
    const [selectedGenre, setSelectedGenre] = useState('');

    const handleApplyFilter = () => {
        if (selectedGenre) {
            onApplyFilter(selectedGenre);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[1000]" onClick={onClose}>
            <div className="relative bg-[#121212] w-full max-w-md h-full max-h-[300px] border border-[#003D1A] rounded-xl p-6 text-[#D4AF37]" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors" onClick={onClose}>✕</button>
                <h2>Filter Movies</h2>
                <div className="flex flex-col gap-4 mt-4">
                    <select
                        className="bg-[#121212] text-[#D4AF37] border border-[#003D1A] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">Select Genre</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Horror">Horror</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                    </select>
                    <select
                        className="bg-[#121212] text-[#D4AF37] border border-[#003D1A] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">Select Showtime</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Late Night">Late Night</option>
                    </select>
                </div>
                
                <button
                    disabled={!selectedGenre}
                    onClick={handleApplyFilter}
                    className="bg-[#003D1A] text-[#D4AF37] hover:bg-[#005A2A] py-2 px-4 rounded-md mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Apply Filter
                </button>
            </div>
        </div>
  );
}