import { Routes, Route } from "react-router-dom";
import BookingPage from "./components/BookingPage";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  );
}