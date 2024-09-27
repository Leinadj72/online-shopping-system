import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import './CSS/LoginSignup.css';
const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { loginUser } = useAuth();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log('Login Function Executed', formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      loginUser(responseData.user);
      window.location.replace('/');
    } else {
      setErrorMessage(responseData.errors);
    }
  };
  const signup = async () => {
    console.log('Signup Function Executed', formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      loginUser(responseData.user);
      window.location.replace('/');
    } else {
      setErrorMessage(responseData.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === 'Sign Up' ? (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              required="required"
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            required="required"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="********"
            required="required"
          />
        </div>
        <button
          onClick={() => {
            if (!isAgreed) {
              setErrorMessage('You must agree to the terms to continue.');
              return;
            }
            state === 'Login' ? login() : signup();
          }}
          // disabled={!isAgreed}
        >
          Continue
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {state === 'Sign Up' ? (
          <p className="loginsignup-login">
            Already have an account?{' '}
            <span
              onClick={() => {
                setState('Login');
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{' '}
            <span
              onClick={() => {
                setState('Sign Up');
              }}
            >
              Click here
            </span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            required="required"
          />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
