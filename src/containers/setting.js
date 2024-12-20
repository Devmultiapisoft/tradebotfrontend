import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

// Custom styles for consistency with other pages
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
    display: "block",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "8px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
};

export default function SettingPage() {
  // State variables for settings
  const [apiKey, setApiKey] = useState("");
  const [PANCAKE_ROUTER_ADDRESS, setPANCAKE_ROUTER_ADDRESS] = useState("");
  const [UPIT_ADDRESS, setUPIT_ADDRESS] = useState("");
  const [upperTarget, setUpperTarget] = useState("");
  const [lowerTarget, setLowerTarget] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [isApprovalRequired, setIsApprovalRequired] = useState(false); // State for approval requirement
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
        setPANCAKE_ROUTER_ADDRESS(response.data.pancakerouteraddress || "");
        setUPIT_ADDRESS(response.data.upitaddress || "");
        setIsApprovalRequired(response.data.isApprovalRequired || false); // Set approval flag
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
      isApprovalRequired: isApprovalRequired || false,
      pancakerouteraddress:PANCAKE_ROUTER_ADDRESS,
      upitaddress:UPIT_ADDRESS,
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
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <div style={styles.container}>
        <h2 style={styles.header}>Update Trading Bot Settings</h2>
        <form onSubmit={handleSubmit}>
         

          <div style={styles.formGroup}>
            <label htmlFor="PANCAKE_ROUTER_ADDRESS" style={styles.label}>
              Pancake Router Address:
            </label>
            <input
              type="text"
              id="PANCAKE_ROUTER_ADDRESS"
              value={PANCAKE_ROUTER_ADDRESS}
              onChange={(e) => setPANCAKE_ROUTER_ADDRESS(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="UPIT_ADDRESS" style={styles.label}>
              UPIT Address:
            </label>
            <input
              type="text"
              id="UPIT_ADDRESS"
              value={UPIT_ADDRESS}
              onChange={(e) => setUPIT_ADDRESS(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="upperTarget" style={styles.label}>
              Upper Target Price (USDT):
            </label>
            <input
              type="number"
              id="upperTarget"
              value={upperTarget}
              onChange={(e) => setUpperTarget(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="lowerTarget" style={styles.label}>
              Lower Target Price (USDT):
            </label>
            <input
              type="number"
              id="lowerTarget"
              value={lowerTarget}
              onChange={(e) => setLowerTarget(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="sellAmount" style={styles.label}>
              Sell Amount (in USD):
            </label>
            <input
              type="number"
              id="sellAmount"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Toggle for isApprovalRequired */}
          <div style={styles.formGroup} >
            <label style={{ display: "block", marginBottom: "5px",color:"#000" }}>Require Approval:</label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={isApprovalRequired}
                onChange={() => setIsApprovalRequired((prev) => !prev)}
                style={{ marginRight: "10px" }}
              />
              {isApprovalRequired ? "Yes" : "No"}
            </label>
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
