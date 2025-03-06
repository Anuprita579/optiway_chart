import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { database } from "../Firebase/config";
import { ref, onValue } from "firebase/database";
import { motion } from "framer-motion";

const DispatchedRoutes = () => {
  const { companyId } = useParams();
  const [dispatchedRoutes, setDispatchedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dispatchedRef = ref(database, `departed/${companyId}`);

    const unsubscribe = onValue(
      dispatchedRef,
      (snapshot) => {
        const dispatchedData = snapshot.val();
        if (dispatchedData) {
          const dispatchedList = Object.keys(dispatchedData).map((key) => ({
            id: key,
            ...dispatchedData[key],
          }));
          setDispatchedRoutes(dispatchedList);
        } else {
          setDispatchedRoutes([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching dispatched routes:", error);
        setError("Failed to fetch dispatched routes.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center text-lg font-semibold mt-5">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🚚 Dispatched Routes</h2>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {dispatchedRoutes.map((route) => (
          <motion.li
            key={route.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-700">{route.routeName}</h3>
              <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                FleetX
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              🚛 Vehicle: <span className="font-medium">{route.vehicleId}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {route.nodes &&
                route.nodes.map((node, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-gray-700 font-medium">
                        📦 {node.nature} ({node.type})
                      </p>
                      <p className="text-xs text-gray-500">
                        Lat: {node.latitude}, Lng: {node.longitude}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default DispatchedRoutes;
