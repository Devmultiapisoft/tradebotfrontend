import React, { useState } from "react";

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Update settings, send to API or store locally
    console.log("Updated Settings: ", {
      apiKey,
      PANCAKE_ROUTER_ADDRESS,

      UPIT_ADDRESS,
   
    });

    // Example: send to an API or handle accordingly
    // fetch('/update-settings', { method: 'POST', body: { apiKey, PANCAKE_ROUTER_ADDRESS, USDT_ADDRESS, UPIT_ADDRESS, sellAmount } })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error updating settings:', error));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <div style={styles.container}>
        <h2 style={styles.header}>Update Trading Bot Settings</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="apiKey" style={styles.label}>
              API Key:
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              style={styles.input}
            />
          </div>

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
