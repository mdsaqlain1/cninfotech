import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
}

const AgentsList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/agents/all');
        setAgents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agents', error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading agents...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Agents List</h2>
      {agents.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr key={agent._id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{agent.name}</td>
                <td className="px-4 py-2">{agent.email}</td>
                <td className="px-4 py-2">{agent.mobileNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgentsList;
