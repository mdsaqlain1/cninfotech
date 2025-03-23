import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AddAgentForm from "../components/AddAgentForm";
import UploadCSV from "../components/UploadCSV";
import DistributedList from "../components/DistributedLists";
import AgentsList from "../components/AgentsList";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    const verifyToken = async () => {
      try {
        const res = await api.get('/auth/me');
        if (!res.data) navigate('/login');
      } catch (err) {
        console.error("Invalid or expired token:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed top-0 w-full z-10">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 mt-16">
        {/* Add Agent Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add Agent</h2>
          <AddAgentForm />
        </div>

        {/* CSV Upload */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload CSV & Distribute
          </h2>
          <UploadCSV />
        </div>
      </div>

      <div className="p-8">
        <AgentsList />
      </div>

      {/* Distributed Lists */}
      <div className="p-8">
        <DistributedList />
      </div>
    </div>
  );
};

export default Dashboard;
