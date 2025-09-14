import React, { useState, useEffect } from "react";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import api from "../api/axios"; // ✅ axios instance

// Register chart.js modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [chartType, setChartType] = useState("pie");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/api/dashboard/summary");
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  const labels = ["Patients", "Doctors", "Appointments"];
  const values = [
    summary.users.patients,
    summary.users.doctors,
    summary.appointments.total,
  ];
  const colors = ["#0d6efd", "#198754", "#ffc107"];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Count",
        data: values,
        backgroundColor:
          chartType === "line" ? "rgba(13,110,253,0.4)" : colors,
        borderColor: chartType === "line" ? "#0d6efd" : colors,
        borderWidth: 2,
        fill: chartType === "line" ? true : false,
        tension: chartType === "line" ? 0.4 : 0,
        pointRadius: chartType === "line" ? 6 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Hospital Overview" },
    },
  };

  const renderChart = () => {
    if (chartType === "pie") return <Pie data={chartData} options={options} />;
    if (chartType === "bar") return <Bar data={chartData} options={options} />;
    if (chartType === "line")
      return <Line data={chartData} options={options} />;
    if (chartType === "doughnut")
      return <Doughnut data={chartData} options={options} />;
    return null;
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center fw-bold text-decoration-underline">Dashboard</h3>

      {/* Chart Switch */}
      <div className="btn-group mb-3" role="group">
        {["pie", "bar", "line", "doughnut"].map((type) => (
          <button
            key={type}
            className={`btn btn-outline-primary ${
              chartType === type ? "active" : ""
            }`}
            onClick={() => setChartType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-3 shadow-sm">
        <div style={{ position: "relative", height: "400px", width: "100%" }}>
          {renderChart()}
        </div>
      </div>

      {/* Stats */}
      <div className="row mt-4">
        <div className="col-md-4 mt-2">
          <div className="card text-center p-3 shadow-sm">
            <h5>Patients</h5>
            <p className="fw-bold">{summary.users.patients}</p>
          </div>
        </div>
        <div className="col-md-4 mt-2">
          <div className="card text-center p-3 shadow-sm">
            <h5>Doctors</h5>
            <p className="fw-bold">{summary.users.doctors}</p>
          </div>
        </div>
        <div className="col-md-4 mt-2">
          <div className="card text-center p-3 shadow-sm">
            <h5>Appointments</h5>
            <p className="fw-bold">{summary.appointments.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
