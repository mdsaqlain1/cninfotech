import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Item {
  firstName: string;
  phone: string;
  notes: string;
}

interface AgentList {
  agent: {
    name: string;
    email: string;
    mobile: string;
  };
  items: Item[];
}

const DistributedList: React.FC = () => {
  const [lists, setLists] = useState<AgentList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await api.get('/tasks/all');
        setLists(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  if (loading) return <p>Loading agent lists...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Distributed Lists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list, index) => (
          <div key={index} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-bold">{list.agent.name} ({list.agent.email})</h3>
            <ul className="mt-2">
              {list.items.map((item, idx) => (
                <li key={idx} className="border-b py-2">
                  <p><strong>Name:</strong> {item.firstName}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Notes:</strong> {item.notes}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributedList;
