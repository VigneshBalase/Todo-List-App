import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../css/signup.css';

const SignUpSignIn = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
        username: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
      });
      alert('Registration successful! Please sign in.');
      setIsRightPanelActive(false);
      setSignUpData({ name: '', email: '', password: '' });
      navigate('/home'); // Redirect to Home after sign-up
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: signInData.email,
        password: signInData.password,
      });
  
      // 1. Store the token
      localStorage.setItem('token', response.data.token);
  
      const decoded = jwtDecode(response.data.token);
        console.log('Decoded JWT:', decoded);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', decoded.id); 
  
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="body">
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account 🚀</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input 
              type="text" 
              name="name"
              placeholder="👤 Name" 
              value={signUpData.name}
              onChange={handleSignUpChange}
              required 
            />
            <input 
              type="email" 
              name="email"
              placeholder="📧 Email" 
              value={signUpData.email}
              onChange={handleSignUpChange}
              required
            />
            <input 
              type="password" 
              name="password"
              placeholder="🔒 Password" 
              value={signUpData.password}
              onChange={handleSignUpChange}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In 👋</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            <input 
                type="email" 
                name="email"
                placeholder="📧 Email" 
                value={signInData.email}
                onChange={handleSignInChange}
                required
                />
            <input 
              type="password" 
              name="password"
              placeholder="🔒 Password" 
              value={signInData.password}
              onChange={handleSignInChange}
              required
            />
            <a href="#">Forgot your password? 🤔</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Overlay Left Panel (Shown when Sign In is active) */}
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back! 🎉</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>

            {/* Overlay Right Panel (Shown when Sign Up is active) */}
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend! ✨</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright">
        @copyright by dipesh
      </div>
    </div>
  );
};

export default SignUpSignIn;