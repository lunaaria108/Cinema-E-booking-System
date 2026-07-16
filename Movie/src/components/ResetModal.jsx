export default function ResetModal({ onClose }) {
    return (
         <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[1000]" onClick={onClose}>
            <div className="w-full max-w-sm relative bg-[#121212] border border-[#003D1A] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors" onClick={onClose}>✕</button>
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex flex-col items-center gap-4">
                        <form className ="flex flex-col items-center justify-center gap-10 mt-10">
                            <div className="flex items-center">
                                <label htmlFor="email" className="w-24 text-[#D4AF37] text-left">
                                    Email:
                                </label>
                                <input type="email" id="email" name="email" required className="bg-[#0b0b0b] border border-[#D4AF37] rounded-md px-2 py-1 ml-2" />
                            </div>
                            <button className="w-[200px] h-[50px] bg-[#003D1A] text-[#D4AF37] px-4 py-1.5 rounded-lg border border-[#D4AF37] hover:bg-[#0a5229]
                             transition-colors" onClick={() => alert('Please check your email for password reset instructions.')}>
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>        
    );
}
