import React, { useEffect, useState } from "react";
import { database } from "../../Firebase/config";
import { ref, onValue } from "firebase/database";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DriverChart = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the "drivers" node in the database
    const driversRef = ref(database, "drivers");

    // Fetch data in real-time
    onValue(driversRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const driversArray = [];

        // Handle the nested structure
        if (Array.isArray(data)) {
          // If data is an array
          data.forEach((item) => {
            // Get the license number (which appears to be the first key)
            const licenseKey = Object.keys(item)[0];
            if (item[licenseKey]) {
              driversArray.push({
                id: licenseKey,
                ...item[licenseKey],
              });
            }
          });
        } else if (typeof data === "object") {
          // If data is an object
          Object.keys(data).forEach((key) => {
            const item = data[key];
            // Check if this is a nested structure
            const innerKeys = Object.keys(item);
            if (
              innerKeys.length > 0 &&
              typeof item[innerKeys[0]] === "object"
            ) {
              // Handle nested structure (license as key)
              const licenseKey = innerKeys[0];
              driversArray.push({
                id: licenseKey,
                ...item[licenseKey],
              });
            } else {
              // Regular structure
              driversArray.push({
                id: key,
                ...item,
              });
            }
          });
        }

        setDrivers(driversArray);
      } else {
        setDrivers([]);
      }
      setLoading(false);
    });
  }, []);

  console.log("Processed Drivers for Dashboard:", drivers);

  // Calculate statistics for charts
  const availableDrivers = drivers.filter(
    (driver) => driver.isAvailable
  ).length;
  const unavailableDrivers = drivers.length - availableDrivers;

  // Pie chart data for driver availability
  const availabilityData = {
    labels: ["Available", "Unavailable"],
    datasets: [
      {
        data: [availableDrivers, unavailableDrivers],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  // Count drivers by some property (example: first letter of name)
  const getDriversByFirstLetter = () => {
    const counts = {};
    drivers.forEach((driver) => {
      if (driver.name) {
        const firstLetter = driver.name.charAt(0).toUpperCase();
        counts[firstLetter] = (counts[firstLetter] || 0) + 1;
      }
    });
    return counts;
  };

  const nameData = getDriversByFirstLetter();

  // Bar chart data
  const driverDistributionData = {
    labels: Object.keys(nameData).sort(),
    datasets: [
      {
        label: "Drivers by Name Initial",
        data: Object.keys(nameData)
          .sort()
          .map((key) => nameData[key]),
        backgroundColor: "#60a5fa",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : drivers.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Driver Statistics</h3>
              <div className="space-y-2">
                <p>
                  <strong>Total Drivers:</strong> {drivers.length}
                </p>
                <p>
                  <strong>Available Drivers:</strong> {availableDrivers}
                </p>
                <p>
                  <strong>Unavailable Drivers:</strong> {unavailableDrivers}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Driver Availability
              </h3>
              <div style={{ height: "250px" }}>
                <Pie
                  data={availabilityData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">Driver Distribution</h3>
            <div style={{ height: "300px" }}>
              <Bar
                data={driverDistributionData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Drivers by Name Initial",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Drivers List</h3>
            <ul className="space-y-4">
              {drivers.map((driver) => (
                <li
                  key={driver.id || driver.licenseNumber}
                  className="border p-4 rounded-lg flex items-center gap-4"
                >
                  {driver.imagePath && (
                    <img
                      src={driver.imagePath}
                      alt={`Driver ${driver.name}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p>
                      <strong>Name:</strong> {driver.name}
                    </p>
                    <p>
                      <strong>Contact:</strong> {driver.contactNumber}
                    </p>
                    <p>
                      <strong>License:</strong> {driver.licenseNumber}
                    </p>
                    <p
                      className={
                        driver.isAvailable ? "text-green-600" : "text-red-600"
                      }
                    >
                      <strong>Status:</strong>{" "}
                      {driver.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No drivers found.</p>
      )}
    </div>
  );
};

export default DriverChart;
