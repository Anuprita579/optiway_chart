import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Route, CarTaxiFront, Send, ArrowRight } from "lucide-react";
import { Snackbar, Alert } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleNavigation = (sectionId) => {
    if (
      !companyId &&
      (sectionId === "route-management" || sectionId === "dispatch-management")
    ) {
      setAlertOpen(true);
      return;
    }

    switch (sectionId) {
      case "driver-management":
        navigate(`/driver`);
        break;
      case "vehicle-management":
        navigate(
          companyId ? `/companyVehicle/${companyId}` : `/vehicle`
        );
        break;
      case "route-management":
        navigate(`/routes/${companyId}`);
        break;
      case "dispatch-management":
        navigate(`/dispatch/${companyId}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
      {/* Hero Section */}
      <div
        className="relative w-full flex flex-col items-center py-16 px-6 h-96"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          Streamline Your Fleet Operations with FleetX
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-2xl">
          Transform your fleet management with real-time tracking, smart
          analytics, and automated dispatch solutions.
        </p>
      </div>

      {/* Company Selector */}
      <div className="mt-6 mb-8">
        <label className="text-lg font-semibold">Select Company:</label>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="ml-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="">-- Select a Company --</option>
          <option value="006QP0QzOrN0xmHzOx1UfMzFu293">Company 1</option>
          <option value="2I4lI3hkmLY7AdIup7eNXkEnlh82">Company 2</option>
          <option value="ouIlPBsgb8ZCUjCkOjWvcVuWL6T2">Company 3</option>
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white max-w-3xl">
        {[
          { id: "driver-management", icon: Users, title: "Driver Management" },
          {
            id: "vehicle-management",
            icon: CarTaxiFront,
            title: "Vehicle Management",
          },
          { id: "route-management", icon: Route, title: "Route Management" },
          {
            id: "dispatch-management",
            icon: Send,
            title: "Dispatch Management",
          },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => handleNavigation(section.id)}
            className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-blue-500/50 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-3 group"
          >
            <section.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
            {section.title}
            <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Snackbar Alert at the Top */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top
      >
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          Please select a company before accessing Route or Dispatch Management.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
