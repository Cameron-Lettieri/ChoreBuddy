import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/LoginPage.css';


function LoginPage() {
    const [phone_number, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const endpoint = 'http://localhost:8000/api/login'; // Update with your backend endpoint

        const data = {
            phone_number,
            password,
        };
        try {
            const response = await axios.post(endpoint, data);
            console.log(response.data); // Optional: Print the response for testing

            // Check if the login was successful based on the HTTP status code
            if (response.status === 200) {
                navigate('/home'); // Redirect to the homepage after successful login
            } else {
                setErrorMessage('Incorrect phone number or password');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.'); // Display error message
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <input
                    className="login-input"
                    type="text"
                    placeholder="Phone Number"
                    value={phone_number}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" type="submit">Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default LoginPage;