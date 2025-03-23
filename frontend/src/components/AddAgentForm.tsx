import React, { useState } from 'react';
import api from '../services/api';

const AddAgentForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default country code
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Create full number on every change
  const fullMobileNumber = `${countryCode}${mobileNumber}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/agents/add', {
        name,
        email,
        mobileNumber: fullMobileNumber,
        password,
      });
      setMessage('Agent added successfully!');
      setName('');
      setEmail('');
      setCountryCode('+91');
      setMobileNumber('');
      setPassword('');
      window.location.reload();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error adding agent');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Mobile Number</label>
        <div className="flex">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="border px-3 py-2 rounded-l"
          >
            <option value="+91">+91 (India)</option>
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+61">+61 (Australia)</option>
            {/* Add more country codes as needed */}
          </select>

          <input
            type="tel"
            className="w-full border px-3 py-2 rounded-r"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Optional - Display full merged mobile number */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-500">Full Mobile Number</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
          value={fullMobileNumber}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Add Agent
      </button>
    </form>
  );
};

export default AddAgentForm;
