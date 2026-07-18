export default function AlertModal({ onClose, message}) {
    return (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-1000" onClick={onClose}>
            <div className="w-full max-w-sm relative bg-[#121212] border border-[#003D1A] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-[#D4AF37] text-3xl hover:text-white transition-colors" onClick={onClose}>✕</button>
                <div className="flex flex-col items-center justify-center gap-5 mr-4">
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}