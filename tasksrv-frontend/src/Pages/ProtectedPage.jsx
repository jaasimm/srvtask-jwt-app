import { useEffect, useRef, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(15);
  const navigate = useNavigate();
  const logoutTriggered = useRef(false);
  const intervalRef = useRef(null);

  // ✅ Fetch protected data using the access token
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Access denied');
    }
  };

  // ✅ Countdown timer logic
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (!logoutTriggered.current) {
            logoutTriggered.current = true;
            localStorage.removeItem('accessToken');
            navigate('/');
          }
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  // ✅ Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Manual logout handler
  const handleLogout = async () => {
    await axios.post('/logout');
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  // ✅ Refresh token and reset countdown
 const handleRefresh = async () => {
  try {
    const res = await axios.post('/refresh');
    const { accessToken } = res.data;

    localStorage.setItem('accessToken', accessToken);
    setCountdown(20); // ⏱️ Extend session
    fetchData();
  } catch (err) {
    console.error('Refresh failed:', err);

    // Small delay ensures any state cleanup finishes
    setTimeout(() => {
      navigate('/');
    }, 0);
  }
};


  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Protected Page</h2>
      <p>{message}</p>
      <p style={{ color: countdown <= 5 ? 'red' : 'black' }}>
        Session expires in: {countdown}s
      </p>
      <button onClick={handleLogout}>Logout</button>{' '}
      <button onClick={handleRefresh}>Refresh Token</button>

      <p>refresh token - if you click this button you will get an  20 seconds screen time otherwise you will navigate to login page after the countdown of </p>
      <p>logout - if you want to logout before the countdown ends</p>
    </div>
  );
};

export default ProtectedPage;
