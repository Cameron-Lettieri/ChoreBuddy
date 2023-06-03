import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from './HomePage';
import UserPage from './UserPage';
import GroupListPage from './GroupListPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<UserPage />} />
                <Route path="/groups" element={<GroupListPage />} />
                {/* Add other routes */}
            </Routes>
        </Router>
    );
}

export default App;