import React, { useState } from "react";

export default function TradingPage() {
  // State for trading parameters
  const [upperTarget, setUpperTarget] = useState("");
  const [lowerTarget, setLowerTarget] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);

  // Simulate fetching price (replace with real API calls)
  const fetchCurrentPrice = () => {
    const simulatedPrice = (Math.random() * 10 + 0.5).toFixed(6); // Simulated price
    setCurrentPrice(simulatedPrice);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Trading parameters set:
    Upper Target: ${upperTarget}
    Lower Target: ${lowerTarget}
    Sell Amount in USD: ${sellAmount}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#fff", marginBottom: "20px" }}>User Trading Page</h1>

      {/* Current Price Section */}
      <div
        style={{
          background: "rgb(79 70 229)",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Current Price</h3>
        <p style={{ fontSize: "18px", color: "#111827" }}>
          {currentPrice ? `${currentPrice} USDT/UPiT` : "No data available"}
        </p>
        <button
          style={{
            padding: "10px 20px",
            background: "rgb(0 188 212)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={fetchCurrentPrice}
        >
          Refresh Price
        </button>
      </div>

      {/* Trading Parameters Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Upper Target Price (USDT):</label>
          <input
            type="number"
            value={upperTarget}
            onChange={(e) => setUpperTarget(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D1D5DB",
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Lower Target Price (USDT):</label>
          <input
            type="number"
            value={lowerTarget}
            onChange={(e) => setLowerTarget(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D1D5DB",
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Sell Amount (in USD):</label>
          <input
            type="number"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D1D5DB",
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4F46E5",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Set Trading Parameters
        </button>
      </form>
    </div>
  );
}
