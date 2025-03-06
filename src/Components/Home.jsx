import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Truck,
  Users,
  Navigation,
  Send,
  ArrowRight,
  CheckCircle2,
  Route,
  CarTaxiFront,
  ClipboardList
} from 'lucide-react';

const Home = () => {

    const navigate = useNavigate();
    const { companyId } = useParams();
    const handleNavigation = (sectionId) => {
        switch (sectionId) {
          case 'driver-management':
            navigate('/driver');
            break;
          case 'vehicle-management':
            navigate('/vehicle');
            break;
          case 'route-management':
            navigate(`/routes/${companyId}`); // Ensure companyId exists
            break;
          case 'dispatch-management':
            navigate(`/dispatch/${companyId}`); // Ensure companyId exists
            break;
          default:
            break;
        }
      };

    return (
        <div>
          <div 
        id="hero"
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-green-900/50" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              Streamline Your Fleet Operations with FleetX
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Transform your fleet management with real-time tracking, smart analytics, and automated dispatch solutions.
            </p>
            
            {/* Main Navigation Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { id: 'driver-management', icon: Users, title: 'Driver Management' },
                { id: 'vehicle-management', icon: CarTaxiFront, title: 'Vehicle Management' },
                { id: 'route-management', icon: Route, title: 'Route Management' },
                { id: 'dispatch-management', icon: Send, title: 'Dispatch Management' }
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
          </div>
        </div>
      </div>
        </div>
    );
    };

export default Home;