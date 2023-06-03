import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Welcome to ChoreBuddy</h1>
            <button>
                <Link to="/login">Login</Link>
            </button>
            <button>
                <Link to="/register">Register</Link>
            </button>
        </div>
    );
}

export default HomePage;