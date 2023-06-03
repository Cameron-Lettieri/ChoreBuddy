import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleLoginRegister = async (e) => {
        e.preventDefault();

        const endpoint = 'http://localhost:8000/api/register'; // Update with your backend endpoint

        const data = {
            phone_number: phoneNumber,
            password,
            name,
            email,
        };

        try {
            const response = await axios.post(endpoint, data);
            console.log(response.data); // Optional: Print the response for testing
            navigate('/home'); // Redirect to the homepage after successful registration/login
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.'); // Display error message
        }
    };

    return (
        <div>
            <h1>Login/Register</h1>
            <form onSubmit={handleLoginRegister}>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Register/Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default LoginRegister;