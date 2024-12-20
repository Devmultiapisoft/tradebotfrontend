import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import Swal from "sweetalert2";
import "../app.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [chartData, setChartData] = useState({
    labels: [], // X-axis labels for timestamps
    datasets: [
      {
        label: "UPiT Price",
        data: [], // Y-axis data for prices
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  });

  const [currentPrice, setCurrentPrice] = useState(null); // Initialize as null for better handling
  const [priceChange, setPriceChange] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toFixed(4)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value.toFixed(4)}`,
        },
      },
    },
  };

  // Fetch current price and update chart data
  const fetchPriceData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bot/current-price"); // Use env variable for flexibility
      const { price} = response.data;

      if (price ) {
        setCurrentPrice(price);

        setChartData((prevData) => {
          const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
          const newPrices = [...prevData.datasets[0].data, price];

          if (newPrices.length > 1) {
            const previousPrice = newPrices[newPrices.length - 2];
            const changePercentage = ((price - previousPrice) / previousPrice) * 100;
            setPriceChange(changePercentage.toFixed(2));
          }

          return {
            ...prevData,
            labels: newLabels.slice(-10),
            datasets: [
              {
                ...prevData.datasets[0],
                data: newPrices.slice(-10),
              },
            ],
          };
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Data",
        text: "Could not retrieve the latest price data. Please try again later.",
        showConfirmButton: true,
      });
      console.error("Error fetching price data:", error);
    }
  };

  // Fetch price data every 2 seconds
  useEffect(() => {
    const interval = setInterval(fetchPriceData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Trading Dashboard</h1>
      </header>

      {/* Dashboard Boxes */}
      <section className="dashboard-boxes">
        <div className="dashboard-box">
          <h3>Current Price</h3>
          <p className="price">
            {currentPrice !== null ? `$${currentPrice.toFixed(4)}` : "Loading..."}
          </p>
        </div>
        <div className="dashboard-box">
          <h3>Price Change</h3>
          <p
            className="price-change"
            style={{ color: priceChange >= 0 ? "#22c55e" : "#ef4444" }}
          >
            {priceChange !== null ? `${priceChange >= 0 ? "+" : ""}${priceChange}%` : "Calculating..."}
          </p>
        </div>
      </section>

      {/* Price Trend Chart */}
      <section className="dashboard-chart">
        <h2>Price Trend Over Time</h2>
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
}
