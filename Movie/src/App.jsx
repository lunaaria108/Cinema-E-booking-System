import { Routes, Route } from "react-router-dom";
import BookingPage from "./components/BookingPage";
import HomePage from "./components/HomePage";
import UserProfile from "./components/UserProfile"; 
import SignUpPage from "./components/SignUpPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/profile" element={<UserProfile />} /> 
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
}