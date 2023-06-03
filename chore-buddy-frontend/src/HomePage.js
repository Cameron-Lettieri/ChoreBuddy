import React from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css';

function HomePage() {
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to ChoreBuddy</h1>
            <div className="home-buttons">
                <button className="home-button">
                    <Link to="/login">Login</Link>
                </button>
                <button className="home-button">
                    <Link to="/register">Register</Link>
                </button>
            </div>
        </div>
    );
}

export default HomePage;