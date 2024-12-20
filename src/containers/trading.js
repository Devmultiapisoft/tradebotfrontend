import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import { io } from "socket.io-client"; // Socket.IO client
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js"; // Chart.js for visualizations
import { Line } from "react-chartjs-2"; // React wrapper for Chart.js
import "../assets/css/TradingPage.css"; // Import custom styles
import botImage from "../assets/images/bot.png"; // Placeholder bot image

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const socket = io("http://134.209.149.151:5001", { 
  reconnection: true,  // Allow auto reconnection
  reconnectionAttempts: Infinity,  // Unlimited reconnection attempts
  reconnectionDelay: 1000,  // Reconnect every 1 second if disconnected
  reconnectionDelayMax: 5000,  // Maximum delay of 5 seconds
  timeout: 5000,  // Connection timeout
}); // Connect to the Socket.IO server

export default function TradingPage() {
  const [botMessage, setBotMessage] = useState("");
  const [botRunning, setBotRunning] = useState(false); // Track if the bot is running
  const [priceHistory, setPriceHistory] = useState([]); // Store price data for the chart

  useEffect(() => {
    // Listen for bot messages from the server
    socket.on("botMessage", (message) => {
      setBotMessage(message);
      showNotification(message);
      setBotRunning(true);
    });

    // Listen for price updates (if provided)
    socket.on("priceUpdate", (price) => {
      setPriceHistory((prevHistory) => [...prevHistory, price]);
    });

    // Listen for socket reconnection
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Initial bot status check (optional if not managed by backend)
    socket.emit("checkBotStatus"); // Emit event to check bot status

    // Clean up socket connection on unmount
    return () => {
      socket.off("botMessage");
      socket.off("priceUpdate");
      socket.off("botStatus");
      socket.disconnect();
    };
  }, []);

  // Function to show toast notifications
  const showNotification = (message) => {
    Swal.fire({
      title: message,
      toast: true,
      position: "bottom-left",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      icon: "info",
      background: "#333",
      color: "#fff",
    });
  };

  // Chart.js data
  const chartData = {
    labels: priceHistory.map((_, index) => index + 1), // Generate labels based on data index
    datasets: [
      {
        label: "Price History",
        data: priceHistory,
        fill: false,
        borderColor: "#4caf50",
        backgroundColor: "#4caf50",
        tension: 0.1, // Line smoothing
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top", labels: { color: "#fff" } },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#fff" } },
      y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#fff" } },
    },
  };

  // Start bot function
  const startBot = async () => {
    try {
      const response = await axios.post("http://134.209.149.151:5000/api/bot/start"); // Adjust URL as needed
      console.log("Bot started:", response.data);
      setBotRunning(true);

      Swal.fire({
        icon: "success",
        title: "Bot Started!",
        text: "The bot has been successfully started.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error starting bot:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error starting the bot.",
        showConfirmButton: true,
      });
    }
  };

  // Stop bot function
  const stopBot = async () => {
    try {
      const response = await axios.post("http://134.209.149.151:5000/api/bot/stop"); // Adjust URL as needed
      console.log("Bot stopped:", response.data);
      setBotRunning(false);

      Swal.fire({
        icon: "success",
        title: "Bot Stopped!",
        text: "The bot has been successfully stopped.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error stopping bot:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error stopping the bot.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="trading-page">
      {/* Header */}
      <header className="header gradient-bg">
        <h1>Trading Bot Dashboard</h1>
        <p className="status">
          Bot Status:{" "}
          <span className={botRunning ? "running" : "stopped"}>
            {botRunning ? "Running" : "Stopped"}
          </span>
        </p>
      </header>

      {/* Main Content */}
      <main className="content">
        <div className="card-container">
          {/* Live Price Chart */}
          <div className="chart-card card">
            <h2>Live Price Chart</h2>
            <div className="chart-wrapper">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Bot Information */}
          <div className="info-card card">
            <h2>Bot Activity</h2>
            <img src={botImage} alt="Trading Bot" className="bot-image" />
            <p className="bot-message">
              Latest Message: {botMessage || "No messages yet."}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <button className="button start-button" onClick={startBot} disabled={botRunning}>
          Start Bot
        </button>
        <button className="button stop-button" onClick={stopBot} disabled={!botRunning}>
          Stop Bot
        </button>
      </footer>
    </div>
  );
}
