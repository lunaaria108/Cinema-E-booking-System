import { useState } from "react";
import { loadAuthState } from "../utils/authStorage";

export default function AdminPromotions() {
  const [formData, setFormData] = useState({
    promoCode: "",
    description: "",
    discountAmount: "",
    isPercentage: true,
    expirationDate: "",
    isActive: true
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleDiscountTypeChange(event) {
    setFormData((previous) => ({
      ...previous,
      isPercentage: event.target.value === "true"
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const auth = loadAuthState();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/promotions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            promoCode: formData.promoCode.trim(),
            description: formData.description.trim(),
            discountAmount: Number(formData.discountAmount),
            isPercentage: formData.isPercentage,
            expirationDate: formData.expirationDate,
            isActive: formData.isActive
          })
        }
      );

      const responseText = await response.text();

      let responseData = null;

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { message: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseText ||
            "Unable to create promotion."
        );
      }

      const promotionCode =
        responseData?.promoCode || formData.promoCode.trim();

      setMessage(
        `Promotion ${promotionCode} was created successfully.`
      );

      setFormData({
        promoCode: "",
        description: "",
        discountAmount: "",
        isPercentage: true,
        expirationDate: "",
        isActive: true
      });
    } catch (error) {
      console.error("Promotion creation failed:", error);

      setIsError(true);
      setMessage(
        error.message ||
          "Promotion could not be created. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white">
        Add Promotion
      </h1>

      <p className="mt-4 text-gray-300">
        Create a new promotional offer or discount code.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded border border-[#2a2a2a] bg-[#0f0f0f] p-5"
      >
        <label className="grid gap-2 font-semibold text-gray-200">
          Promotion Code
          <input
            type="text"
            name="promoCode"
            value={formData.promoCode}
            onChange={handleChange}
            placeholder="SUMMER20"
            className="rounded border border-[#333333] bg-[#1a1a1a] p-3 font-normal text-white outline-none focus:border-[#D4AF37]"
            required
          />
        </label>

        <label className="grid gap-2 font-semibold text-gray-200">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Get 20% off movie tickets."
            rows={4}
            className="resize-y rounded border border-[#333333] bg-[#1a1a1a] p-3 font-normal text-white outline-none focus:border-[#D4AF37]"
            required
          />
        </label>

        <label className="grid gap-2 font-semibold text-gray-200">
          Discount Amount
          <input
            type="number"
            name="discountAmount"
            value={formData.discountAmount}
            onChange={handleChange}
            min="0.01"
            max={formData.isPercentage ? "100" : undefined}
            step="0.01"
            placeholder={formData.isPercentage ? "20" : "5.00"}
            className="rounded border border-[#333333] bg-[#1a1a1a] p-3 font-normal text-white outline-none focus:border-[#D4AF37]"
            required
          />
        </label>

        <label className="grid gap-2 font-semibold text-gray-200">
          Discount Type
          <select
            name="isPercentage"
            value={String(formData.isPercentage)}
            onChange={handleDiscountTypeChange}
            className="rounded border border-[#333333] bg-[#1a1a1a] p-3 font-normal text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="true">Percentage</option>
            <option value="false">Fixed Amount</option>
          </select>
        </label>

        <label className="grid gap-2 font-semibold text-gray-200">
          Expiration Date
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="rounded border border-[#333333] bg-[#1a1a1a] p-3 font-normal text-white outline-none focus:border-[#D4AF37]"
            required
          />
        </label>

        <label className="flex items-center gap-2 text-gray-200">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 accent-[#D4AF37]"
          />

          <span>Active promotion</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-fit rounded bg-[#003D1A] px-5 py-3 font-semibold text-[#D4AF37] transition-colors hover:bg-[#005525] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Promotion"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 rounded border p-3 ${
            isError
              ? "border-red-700 bg-red-950 text-red-200"
              : "border-green-700 bg-green-950 text-green-200"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
