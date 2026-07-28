import { useEffect, useState } from "react";
import { loadAuthState } from "../utils/authStorage";

const API_URL = "http://localhost:8080/api/admin/promotions";

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    const auth = loadAuthState();
    return auth?.token;
  };

  const loadPromotions = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || `Unable to load promotions. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setPromotions(data);
    } catch (err) {
      setError(err.message || "Unable to load promotions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const togglePromotion = async (promotionId) => {
    setMessage("");
    setError("");

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/${promotionId}/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || `Unable to update promotion. Status: ${response.status}`
        );
      }

      setMessage("Promotion status updated.");
      await loadPromotions();
    } catch (err) {
      setError(err.message || "Unable to update promotion.");
    }
  };

  const deletePromotion = async (promotionId, promoCode) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete promotion ${promoCode}?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/${promotionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || `Unable to delete promotion. Status: ${response.status}`
        );
      }

      setPromotions((currentPromotions) =>
        currentPromotions.filter(
          (promotion) => promotion.promotionId !== promotionId
        )
      );

      setMessage(`Promotion ${promoCode} deleted.`);
    } catch (err) {
      setError(err.message || "Unable to delete promotion.");
    }
  };

  const formatDiscount = (promotion) => {
    if (promotion.isPercentage) {
      return `${promotion.discountAmount}%`;
    }

    return `$${Number(promotion.discountAmount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold">Manage Promotions</h1>
        <p className="mt-4 text-gray-300">Loading promotions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Promotions</h1>
          <p className="mt-1 text-gray-400">
            View, activate, deactivate, or delete promotions.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPromotions}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-950 p-3 text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-950 p-3 text-red-300">
          {error}
        </div>
      )}

      {promotions.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <p className="text-gray-300">No promotions were found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full bg-gray-900 text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Expiration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {promotions.map((promotion) => (
                <tr
                  key={promotion.promotionId}
                  className="border-t border-gray-700"
                >
                  <td className="px-4 py-3 font-semibold">
                    {promotion.promoCode}
                  </td>

                  <td className="px-4 py-3">
                    {promotion.description}
                  </td>

                  <td className="px-4 py-3">
                    {formatDiscount(promotion)}
                  </td>

                  <td className="px-4 py-3">
                    {promotion.expirationDate}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        promotion.isActive
                          ? "bg-green-900 text-green-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {promotion.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {promotion.created}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          togglePromotion(promotion.promotionId)
                        }
                        className={`rounded px-3 py-2 text-sm font-semibold ${
                          promotion.isActive
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {promotion.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deletePromotion(
                            promotion.promotionId,
                            promotion.promoCode
                          )
                        }
                        className="rounded bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
