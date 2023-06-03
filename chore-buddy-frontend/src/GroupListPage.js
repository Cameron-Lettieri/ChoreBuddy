import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/GroupListPage.css';

function GroupListPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/groups');
            console.log('Response data:', response.data); // Log the response data
            const groupsWithNames = response.data.map((group) => ({
                id: group.id,
                name: group.name,
                choreGroupNames: group.choreGroupNames || [], // Add a default value for choreGroupNames
            }));
            setGroups(groupsWithNames);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setError('Error fetching groups. Please try again later.');
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/groups', {
                groupName: newGroupName,
            });
            const { groupId, name } = response.data;
            setGroups([...groups, { id: groupId, name, choreGroupNames: [] }]);
            setNewGroupName('');
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Error creating group. Please try again later.');
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            const response = await axios.post('http://localhost:8000/api/groups/join', {
                groupId,
            });
            // Handle successful join, e.g., show a success message or update UI.
        } catch (error) {
            console.error('Error joining group:', error);
            setError('Error joining group. Please try again later.');
        }
    };

    const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="group-list-container">
            <div className="group-list-header">
                <h1 className="group-list-title">Group List</h1>
                <form className="group-list-form" onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        placeholder="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="group-list-input"
                    />
                    <button type="submit">Create Group</button>
                </form>
            </div>
            <input
                type="text"
                placeholder="Search Groups"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="group-list-search"
            />
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : filteredGroups.length === 0 ? (
                <p>No groups found.</p>
            ) : (
                <ul className="group-list">
                    {filteredGroups.map((group) => (
                        <li key={group.id}>
                            {group.name}
                            <ul>
                                {group.choreGroupNames.map((choreGroupName) => (
                                    <li key={choreGroupName}>{choreGroupName}</li>
                                ))}
                            </ul>
                            <button className="group-list-button" onClick={() => handleJoinGroup(group.id)}>
                                Join Group
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GroupListPage;