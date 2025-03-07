import React from "react";
import DriverChart from "./Components/Driver/DriverChart";
import VehicleChart from "./Components/Vehicle/VehicleChart";
import Home from "./Components/Home";
import RotesList from "./Components/Routes";
import DispatchedRoutes from "./Components/Dispatched";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CompanyVehicle from "./Components/Vehicle/CompanyVehicle";
function App() {
  return (
    <Router>
    <Routes>
    <Route path='/' element={<Home />} />
    {/* <Route path='/:companyId' element={<Home />} /> */}
    <Route path='/driver' element={<DriverChart />} />
    <Route path='/vehicle' element={<VehicleChart />} />
    <Route path='/companyVehicle/:companyId' element={<CompanyVehicle />} />
    <Route path='/routes/:companyId' element={<RotesList />} />
    <Route path='/dispatch/:companyId' element={<DispatchedRoutes/>} />
    </Routes>
    </Router>
  );
}

export default App;
