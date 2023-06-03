import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({}); // Store all errors in a single state variable

    const navigate = useNavigate();

    const validatePhoneNumber = (phoneNumber) => {
        const isValid = /^\d{10}$/.test(phoneNumber);
        return isValid;
    };

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        return isValid;
    };

    const validatePassword = (password) => {
        const isValid = password.length >= 6;
        return isValid;
    };

    const validateName = (name) => {
        const isValid = name.trim() !== '';
        return isValid;
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        const isPhoneValid = validatePhoneNumber(phoneNumber);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isNameValid = validateName(name);

        // Create an errors object to store all validation errors
        const validationErrors = {};

        if (!isPhoneValid) {
            validationErrors.phoneError = 'Invalid phone number';
        }

        if (!isEmailValid) {
            validationErrors.emailError = 'Invalid email';
        }

        if (!isPasswordValid) {
            validationErrors.passwordError = 'Password should have at least 6 characters';
        }
        if (!isNameValid) {
            validationErrors.nameError = 'Name is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Update errors state
            return;
        }

        const endpoint = 'http://localhost:8000/api/register';

        const data = {
            phone_number: phoneNumber,
            password,
            name,
            email,
        };

        try {
            const response = await axios.post(endpoint, data);
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);
            setErrors({ errorMessage: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneError && <p>{errors.phoneError}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.passwordError && <p>{errors.passwordError}</p>}
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
                {errors.emailError && <p>{errors.emailError}</p>}
                <button type="submit">Register</button>
            </form>
            {errors.errorMessage && <p>{errors.errorMessage}</p>}
        </div>
    );
}

export default RegisterPage;