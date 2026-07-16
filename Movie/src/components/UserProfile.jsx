import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { clearAuthState, loadAuthState } from '../utils/authStorage';

export default function UserProfile() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(() => loadAuthState());
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        promoOptIn: true
    });

    const [address, setAddress] = useState("123 Example Lane, Athens, GA 30601");
    
    const [paymentCards, setPaymentCards] = useState([
        { id: 1, last4: "4242", exp: "12/28" }
    ]);

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/users/profile')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                setUser({
                    firstName: data.firstName || user.firstName,
                    lastName: data.lastName || user.lastName,
                    email: data.email || user.email,
                    promoOptIn: data.promoOptIn !== undefined ? data.promoOptIn : user.promoOptIn
                });
                
                if (data.address) setAddress(data.address);
                if (data.paymentCards) setPaymentCards(data.paymentCards);
            })
            .catch(error => console.error(error));
    }, []);

        const handleLogout = async () => {
            if (auth.token) {
                try {
                    await fetch('http://localhost:8080/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: auth.token }),
                    });
                } catch (error) {
                    console.error('Logout request failed:', error);
                }
            }

            clearAuthState();
            setAuth(loadAuthState());
            navigate('/');
        };

    const handleAddCard = () => {
        if (paymentCards.length < 3) {
            setPaymentCards([...paymentCards, { id: Date.now(), last4: "0000", exp: "00/00" }]);
        }
    };

    const handleDeleteCard = (id) => {
        setPaymentCards(paymentCards.filter(card => card.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-[#f5f1e8] pb-20">
            <NavBar isLoggedIn={Boolean(auth.token)} onLogout={handleLogout} />

            <div className="max-w-6xl mx-auto p-8 mt-6">
                <h1 className="text-4xl font-bebas text-[#D4AF37] mb-8 border-b border-[#003D1A] pb-4">Manage Profile</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <motion.div className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-2xl text-[#D4AF37] mb-4">Personal Information</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <input type="text" value={user.firstName} onChange={(e) => setUser({...user, firstName: e.target.value})} className="w-full bg-black border border-[#003D1A] rounded p-2 text-white" placeholder="First Name" />
                                <input type="text" value={user.lastName} onChange={(e) => setUser({...user, lastName: e.target.value})} className="w-full bg-black border border-[#003D1A] rounded p-2 text-white" placeholder="Last Name" />
                            </div>
                            <label className="text-gray-400 text-sm">Email Address (Cannot be changed)</label>
                            <input type="email" value={user.email} readOnly className="w-full bg-gray-900 border border-gray-700 text-gray-500 rounded p-2 cursor-not-allowed" />
                            
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input type="checkbox" checked={user.promoOptIn} onChange={(e) => setUser({...user, promoOptIn: e.target.checked})} className="accent-[#003D1A]" />
                                Subscribe to promotions
                            </label>
                            <button className="bg-[#003D1A] text-[#D4AF37] py-2 rounded font-bold hover:bg-[#0a5229] mt-2">Save Profile Updates</button>
                        </div>
                    </motion.div>

                    <motion.div className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="text-2xl text-[#D4AF37] mb-4">Change Password</h2>
                        <div className="flex flex-col gap-4">
                            <input type="password" placeholder="Current Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full bg-black border border-[#003D1A] rounded p-2 text-white" />
                            <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-black border border-[#003D1A] rounded p-2 text-white" />
                            <input type="password" placeholder="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full bg-black border border-[#003D1A] rounded p-2 text-white" />
                            <button className="bg-[#003D1A] text-[#D4AF37] py-2 rounded font-bold hover:bg-[#0a5229]">Update Password</button>
                        </div>
                    </motion.div>

                    <motion.div className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-[#D4AF37]">Shipping Address</h2>
                        </div>
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" className="w-full bg-black border border-[#003D1A] rounded p-2 text-white resize-none" placeholder="Enter your home address..."></textarea>
                        <button className="w-full bg-[#003D1A] text-[#D4AF37] py-2 rounded font-bold hover:bg-[#0a5229] mt-4">Save Address</button>
                    </motion.div>

                    <motion.div className="bg-[#121212] p-6 rounded-xl border border-[#003D1A]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-[#D4AF37]">Payment Methods</h2>
                            <span className="text-sm text-gray-400">{paymentCards.length} / 3 Cards</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 mb-4">
                            {paymentCards.map(card => (
                                <div key={card.id} className="flex justify-between items-center bg-black p-3 rounded border border-[#003D1A]">
                                    <div className="text-white">
                                        <p>💳 **** **** **** {card.last4}</p>
                                        <p className="text-sm text-gray-400">Exp: {card.exp}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-[#D4AF37] hover:underline text-sm">Edit</button>
                                        <button onClick={() => handleDeleteCard(card.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleAddCard}
                            disabled={paymentCards.length >= 3}
                            className={`w-full py-2 rounded font-bold border ${paymentCards.length >= 3 ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-transparent text-[#D4AF37] border-[#D4AF37] hover:bg-[#003D1A]'}`}
                        >
                            {paymentCards.length >= 3 ? "Maximum Cards Reached" : "+ Add New Card"}
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}