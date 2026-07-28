import { useState } from "react";

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
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/promotions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            discountAmount: Number(formData.discountAmount)
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to create promotion.");
      }

      const savedPromotion = await response.json();

      setMessage(
        `Promotion ${savedPromotion.promoCode} was created successfully.`
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
      console.error(error);

      setMessage(
        "Promotion could not be created. Make sure the backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.heading}>Create Promotion</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Promotion Code
            <input
              style={styles.input}
              type="text"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleChange}
              placeholder="SUMMER20"
              required
            />
          </label>

          <label style={styles.label}>
            Description
            <textarea
              style={styles.textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Get 20% off movie tickets."
              required
            />
          </label>

          <label style={styles.label}>
            Discount Amount
            <input
              style={styles.input}
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </label>

          <label style={styles.label}>
            Discount Type
            <select
              style={styles.input}
              name="isPercentage"
              value={String(formData.isPercentage)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  isPercentage: event.target.value === "true"
                }))
              }
            >
              <option value="true">Percentage</option>
              <option value="false">Fixed Amount</option>
            </select>
          </label>

          <label style={styles.label}>
            Expiration Date
            <input
              style={styles.input}
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />
          </label>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active promotion
          </label>

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Promotion"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "32px",
    backgroundColor: "#f4f4f4"
  },
  card: {
    width: "100%",
    maxWidth: "550px",
    padding: "32px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)"
  },
  heading: {
    marginTop: 0,
    marginBottom: "24px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    fontWeight: "600"
  },
  input: {
    padding: "11px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "16px"
  },
  textarea: {
    minHeight: "100px",
    padding: "11px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical"
  },
  checkboxLabel: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },
  message: {
    marginTop: "20px"
  }
};
