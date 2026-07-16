import profile_pic from "../assets/profile_pic.jpg";

export default function AdminPage() {
    return (
        <>
            <NavBar booking={true}/>
            
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0b0b] px-4">
                <div className="w-full max-w-lg min-h-[600px] rounded-3xl border-1 border-[#D4AF37] bg-black/90 p-8 shadow-xl flex justify-center items-center flex-col mt-10 mb-10">
                    <div className="flex justify-start gap-4">
                        <img src={profile_pic} alt="Logo" className="h-16 w-16" />
                        <p>Admin Name</p>
                    </div>
                </div>
            </div>
        </>
    );
}
