import React, { useEffect, useState } from "react";
import { database } from "../../Firebase/config";
import { ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
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

const CompanyVehicle = () => {
  const { companyId } = useParams(); // Get companyId from URL
  const [vehicles, setVehicles] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch specific company information
    if (companyId) {
      const companyRef = ref(database, `company/${companyId}`);
      
      onValue(companyRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setCompany({
            id: companyId,
            ...data
          });
        } else {
          setCompany(null);
        }
      });

      // Fetch vehicles for this specific company
      // First try direct path if vehicles are stored under company ID
      const directVehiclesRef = ref(database, `vehicles/${companyId}`);
      
      onValue(directVehiclesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const vehiclesArray = [];
          
          if (typeof data === 'object') {
            Object.keys(data).forEach(vehicleKey => {
              const vehicle = data[vehicleKey];
              
              if (typeof vehicle === 'object') {
                vehiclesArray.push({
                  id: vehicleKey,
                  ownerId: companyId,
                  ...vehicle,
                });
              }
            });
          }
          
          setVehicles(vehiclesArray);
          setLoading(false);
        } else {
          // If no vehicles found directly under company, check all vehicles for this company
          const allVehiclesRef = ref(database, "vehicles");
          
          onValue(allVehiclesRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const vehiclesArray = [];
              
              if (typeof data === 'object') {
                // First level might be company IDs or user IDs
                Object.keys(data).forEach(id => {
                  const vehiclesByOwner = data[id];
                  
                  if (typeof vehiclesByOwner === 'object') {
                    // Second level should have vehicle IDs/numbers as keys
                    Object.keys(vehiclesByOwner).forEach(vehicleKey => {
                      const vehicle = vehiclesByOwner[vehicleKey];
                      
                      if (typeof vehicle === 'object') {
                        // Only include vehicles related to this company
                        if (id === companyId || vehicle.companyId === companyId) {
                          vehiclesArray.push({
                            id: vehicleKey,
                            ownerId: id,
                            ...vehicle,
                          });
                        }
                      }
                    });
                  }
                });
              }
              
              setVehicles(vehiclesArray);
              setLoading(false);
            } else {
              setVehicles([]);
              setLoading(false);
            }
          });
        }
      });
    } else {
      setLoading(false);
      setVehicles([]);
    }
  }, [companyId]);

  // Count vehicles by type
  const getVehiclesByType = () => {
    const types = {};
    vehicles.forEach(vehicle => {
      if (vehicle.type) {
        const type = vehicle.type;
        types[type] = (types[type] || 0) + 1;
      } else {
        types["Unspecified"] = (types["Unspecified"] || 0) + 1;
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
          '#f87171', '#4ade80', '#facc15', '#c084fc', '#f97316',
          '#a3e635', '#fb7185', '#38bdf8', '#a78bfa'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">
        {company ? `${company.name || 'Company'} Vehicle Dashboard` : 'Company Vehicle Dashboard'}
      </h2>
      
      {loading ? (
        <p>Loading company vehicles...</p>
      ) : !companyId ? (
        <p>No company ID provided. Please specify a company.</p>
      ) : vehicles.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Vehicle Statistics</h3>
              <div className="space-y-2">
                <p><strong>Company ID:</strong> {companyId}</p>
                <p><strong>Company Name:</strong> {company ? (company.name || 'N/A') : 'Unknown'}</p>
                <p><strong>Total Vehicles:</strong> {vehicles.length}</p>
                <p><strong>Vehicle Types:</strong> {Object.keys(vehicleTypes).length}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Vehicle Types</h3>
              <div style={{ height: "250px" }}>
                {Object.keys(vehicleTypes).length > 0 ? (
                  <Pie 
                    data={typeData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      },
                    }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>No vehicle type data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Vehicles List</h3>
            <ul className="space-y-4">
              {vehicles.map((vehicle) => (
                <li key={vehicle.id || vehicle.number} className="border p-4 rounded-lg">
                  <div>
                    <p><strong>Name:</strong> {vehicle.name || 'N/A'}</p>
                    <p><strong>Number:</strong> {vehicle.number || 'N/A'}</p>
                    <p><strong>Type:</strong> {vehicle.type || "Unspecified"}</p>
                    {vehicle.driverName && <p><strong>Driver:</strong> {vehicle.driverName}</p>}
                    {vehicle.status && <p><strong>Status:</strong> {vehicle.status}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No vehicles found for this company.</p>
      )}
    </div>
  );
};

export default CompanyVehicle;