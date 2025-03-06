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
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

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

const VehicleChart = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the "vehicles" node in the database
    const vehiclesRef = ref(database, "vehicles");
    
    // Fetch data in real-time
    onValue(vehiclesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const vehiclesArray = [];
        
        if (typeof data === 'object') {
          // First level is user IDs
          Object.keys(data).forEach(userId => {
            const userVehicles = data[userId];
            
            // Check if user has vehicles
            if (typeof userVehicles === 'object') {
              // Second level might have vehicle IDs/numbers as keys
              Object.keys(userVehicles).forEach(vehicleKey => {
                const vehicle = userVehicles[vehicleKey];
                
                // Add the vehicle to our array with user ID for reference
                if (typeof vehicle === 'object') {
                  vehiclesArray.push({
                    id: vehicleKey,
                    userId: userId,
                    ...vehicle
                  });
                }
              });
            }
          });
        }
        
        setVehicles(vehiclesArray);
      } else {
        setVehicles([]);
      }
      setLoading(false);
    });
  }, []);

  console.log("Processed Vehicles for Dashboard:", vehicles);

  // Count vehicles by type
  const getVehiclesByType = () => {
    const types = {};
    vehicles.forEach(vehicle => {
      if (vehicle.type) {
        const type = vehicle.type;
        types[type] = (types[type] || 0) + 1;
      }
    });
    return types;
  };

  const vehicleTypes = getVehiclesByType();
  
  // Pie chart data for vehicle types
  const typeData = {
    labels: Object.keys(vehicleTypes),
    datasets: [
      {
        data: Object.values(vehicleTypes),
        backgroundColor: [
          '#4ade80', '#f87171', '#60a5fa', '#facc15', '#c084fc', 
          '#f97316', '#a3e635', '#fb7185', '#38bdf8'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Count vehicles by user
  const getVehiclesByUser = () => {
    const users = {};
    vehicles.forEach(vehicle => {
      if (vehicle.userId) {
        const userId = vehicle.userId.substring(0, 8); // Use first 8 chars for readability
        users[userId] = (users[userId] || 0) + 1;
      }
    });
    return users;
  };

  const userVehicles = getVehiclesByUser();
  
  // Bar chart data for vehicles by user
  const userDistributionData = {
    labels: Object.keys(userVehicles),
    datasets: [
      {
        label: 'Vehicles by User',
        data: Object.values(userVehicles),
        backgroundColor: '#60a5fa',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Vehicle Dashboard</h2>
      
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : vehicles.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Vehicle Statistics</h3>
              <div className="space-y-2">
                <p><strong>Total Vehicles:</strong> {vehicles.length}</p>
                <p><strong>Vehicle Types:</strong> {Object.keys(vehicleTypes).length}</p>
                <p><strong>Users with Vehicles:</strong> {Object.keys(userVehicles).length}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Vehicle Types</h3>
              <div style={{ height: "250px" }}>
                <Pie 
                  data={typeData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">Vehicles by User</h3>
            <div style={{ height: "300px" }}>
              <Bar 
                data={userDistributionData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Vehicle Distribution by User'
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Vehicles List</h3>
            <ul className="space-y-4">
              {vehicles.map((vehicle) => (
                <li key={vehicle.id || vehicle.number} className="border p-4 rounded-lg">
                  <div>
                    <p><strong>Name:</strong> {vehicle.name}</p>
                    <p><strong>Number:</strong> {vehicle.number}</p>
                    <p><strong>Type:</strong> {vehicle.type}</p>
                    <p><strong>User ID:</strong> <span className="text-gray-500 text-sm">{vehicle.userId}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No vehicles found.</p>
      )}
    </div>
  );
};

export default VehicleChart;