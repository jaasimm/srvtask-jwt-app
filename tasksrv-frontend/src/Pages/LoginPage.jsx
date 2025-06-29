import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      }, { withCredentials: true });

      const { accessToken } = res.data;

      // ✅ Store token in localStorage
      localStorage.setItem('accessToken', accessToken);

      // ✅ Navigate to protected route
      navigate('/protected');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <center>
        <h1>Login</h1>
        <input type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} required /> <br />
      <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required /> <br /><br />
     <button type="submit">Login</button></center> 
     <p>
      login with these withCredentials <br /> <br />
      email- srv100@gmail.com, srv101@gmail.com ,srv102@gmail.com, srv103@gmail.com <br /> <br />
      password - 123456 <br />

     </p>
    </form>
  );
};

export default LoginPage;
