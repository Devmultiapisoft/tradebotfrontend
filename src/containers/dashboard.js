import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // X-axis labels
    datasets: [
      {
        label: "UPiT Price",
        data: [0.03, 0.04, 0.05, 0.04, 0.03, 0.05, 0.06], // Y-axis data points
        fill: false,
        borderColor: "#3b82f6", // Line color
        tension: 0.4, // Smooth curve
        pointRadius: 4, // Point size on the graph
        pointBackgroundColor: "#3b82f6", // Point color
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000, // Animation duration in milliseconds
      easing: "easeInOutQuad", // Easing effect for smooth transitions
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toFixed(4)}`, // Format tooltip value
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value.toFixed(4)}`, // Format Y-axis labels
        },
      },
    },
  };

  // Simulate price fluctuation and update the chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const lastPrice = prevData.datasets[0].data[prevData.datasets[0].data.length - 1];
        const randomChange = (Math.random() - 0.5) * 0.01; // Random fluctuation between -0.005 and 0.005
        const newPrice = Math.max(0.01, lastPrice + randomChange); // Prevent price from going below 0.01

        // Remove the oldest data point and add the new price
        const newData = [...prevData.datasets[0].data.slice(1), newPrice];

        return {
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f9fafb", minHeight: "100vh", backgroundColor: "#000000" }}>
      {/* Header */}
      <header
        style={{
          background: "rgb(99 102 241)",
          padding: "10px 20px",
          color: "rgb(99 102 241)",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0 }}>Welcome to your Trading Dashboard</h1>
      </header>

      {/* Dashboard Boxes */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Trading Balance */}
        <div
          style={{
            background: "rgb(0 0 0)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "rgb(255 255 255) 1px 4px 16px -9px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2>Trading Balance</h2>
          <p style={{ fontSize: "24px", color: "#16a34a" }}>$1,230.45</p>
        </div>

        {/* Current Token Price */}
        <div
          style={{
            background: "rgb(0 0 0)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "rgb(255 255 255) 1px 4px 16px -9px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2>Current UPiT Price</h2>
          <p style={{ fontSize: "24px", color: "#3b82f6" }}>$0.0345</p>
        </div>

        {/* Recent Trades */}
        <div
          style={{
            background: "rgb(0 0 0)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "rgb(255 255 255) 1px 4px 16px -9px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2>Recent Trades</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Buy: 500 UPiT @ $0.033</li>
            <li>Sell: 300 UPiT @ $0.035</li>
            <li>Buy: 700 UPiT @ $0.032</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "rgb(0 0 0)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "rgb(255 255 255) 1px 4px 16px -9px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2>Quick Actions</h2>
          <button
            style={{
              background: "rgb(99 102 241)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Place a Trade
          </button>
        </div>

        {/* Animated Trading Chart */}
        <div
          style={{
            background: "rgb(0 0 0)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "rgb(255 255 255) 1px 4px 16px -9px",
            textAlign: "center",
            color: "#fff",
            gridColumn: "span 2", // Make chart span across two columns for more space
          }}
        >
          <h2>Price Trend (UPiT)</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
}
