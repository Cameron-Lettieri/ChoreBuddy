import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/UserPage.css';

function UserPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [choreGroups, setChoreGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user', { withCredentials: true });

                if (response.status === 200) {
                    const userData = response.data;
                    setName(userData.name);
                    setLoggedIn(true);
                } else {
                    setLoggedIn(false);
                    navigate('/login');
                }

                const responseGroups = await axios.get('/api/groups');
                const groupsData = responseGroups.data;
                setChoreGroups(groupsData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [navigate]);


    const handleAddGroup = async () => {
        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupName: newGroupName }),
            });

            if (response.ok) {
                const newGroup = await response.json();
                setChoreGroups([...choreGroups, newGroup]);
                setNewGroupName('');
            } else {
                console.error('Failed to create chore group');
            }
        } catch (error) {
            console.error('Error adding chore group:', error);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            const response = await fetch(`/api/groups/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId }),
            });

            if (response.ok) {
                const groupToJoin = choreGroups.find((group) => group.id === groupId);
                navigate(`/group/${groupId}`);
            } else {
                console.error('Failed to join chore group');
            }
        } catch (error) {
            console.error('Error joining chore group:', error);
        }
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            const response = await fetch(`/api/groups/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId }),
            });

            if (response.ok) {
                setChoreGroups(choreGroups.filter((group) => group.id !== groupId));
            } else {
                console.error('Failed to leave chore group');
            }
        } catch (error) {
            console.error('Error leaving chore group:', error);
        }
    };

    const handleSelectGroup = (groupId) => {
        navigate(`/group/${groupId}`);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                credentials: 'include', // Include credentials for session management
            });
            setLoggedIn(false);
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="user-container">
            <h1 className="user-title">Welcome, {name}!</h1>

            <div className="user-section text-center">
                <h2>Join an Existing Chore Group or Create a New Group</h2>
                <button className="user-button" onClick={() => navigate('/groups')}>
                    Browse Groups
                </button>
            </div>

            <div className="user-section">
                <h2>Your Chore Groups</h2>
                {choreGroups.map((group) => (
                    <div className="user-group" key={group.id}>
                        <span>{group.name}</span>
                        <button className="user-button" onClick={() => handleLeaveGroup(group.id)}>
                            Leave
                        </button>
                        <button className="user-button" onClick={() => handleSelectGroup(group.id)}>
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPage;