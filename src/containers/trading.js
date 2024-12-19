import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct import

export default function TradingPage() {
  // State for trading parameters
  const [upperTarget, setUpperTarget] = useState("");
  const [lowerTarget, setLowerTarget] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch the current price from the backend
  const fetchCurrentPrice = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:5000/api/bot/current-price"); // Backend endpoint for current price
      setCurrentPrice(response.data.price); // Assuming the response has 'price' field
    } catch (error) {
      console.error("Error fetching price:", error);
      alert("Failed to fetch current price");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch trading parameters from the backend
  const fetchTradingParameters = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:5000/api/bot/trading-parameters/${user.id}`);
        setUpperTarget(response.data.targetPrice || "");
        setLowerTarget(response.data.lowerTargetPrice || "");
        setSellAmount(response.data.sellAmountUSD || "");
      } catch (error) {
        console.error("Error fetching trading parameters:", error);
        alert("Failed to fetch trading parameters");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken); // Assuming the user data is in the 'user' key of the decoded token
    }
  }, []);

  // Fetch trading parameters after user is set
  useEffect(() => {
    if (user) {
      fetchTradingParameters();
    }
  }, [user]);

  // Handle the form submission and send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tradingParams = {
      targetPrice: upperTarget,
      lowerTargetPrice: lowerTarget,
      sellAmountUSD: sellAmount,
      userid: user.id,
    };

    try {
      await axios.post("http://localhost:5000/api/bot/trading-parameters", tradingParams); // Backend endpoint for trading parameters
      alert("Trading parameters have been set!");
    } catch (error) {
      console.error("Error submitting trading parameters:", error);
      alert("Failed to set trading parameters.");
    }
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
          disabled={loading} // Disable button while loading
        >
          {loading ? "Refreshing Price..." : "Refresh Price"}
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
