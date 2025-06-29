import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to the Home Page</h2>
      <p>You are logged in.</p>
      <button onClick={() => navigate('/protected')}>Go to Protected Page</button><br /><br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;