const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Set to true if using HTTPS
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

app.get('/', (req, res) => {
    res.send('Chore Buddy backend is running!');
});

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost', // Replace with your MySQL host
    user: 'root', // Replace with your MySQL username
    password: 'password', // Replace with your MySQL password
    database: 'chore-buddy-sql', // Replace with your database name
});

// Test the MySQL connection
pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
    connection.release();
});

// Create a WebSocket server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        broadcastMessage(message);
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

function broadcastMessage(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

//REGISTER
app.post('/api/register', (req, res) => {
    const { phone_number, password, name, email } = req.body;

    // Check if the required fields are provided
    if (!phone_number || !password) {
        return res.status(400).json({ message: 'Phone number and password are required.' });
    }

    // Check if the user already exists in the database
    const checkUserQuery = `SELECT * FROM users WHERE phone_number = ?`;
    pool.query(checkUserQuery, [phone_number], (error, results) => {
        if (error) {
            console.error('Error checking user:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Phone number in use.' });
        }

        // Hash the password (using bcrypt)
        bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) {
                console.error('Error hashing password:', hashError);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            // Insert the user into the database
            const insertUserQuery = `INSERT INTO users (phone_number, password, name, email) VALUES (?, ?, ?, ?)`;
            pool.query(insertUserQuery, [phone_number, hashedPassword, name, email], (insertError) => {
                if (insertError) {
                    console.error('Error inserting user:', insertError);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                res.status(201).json({ message: 'User registered successfully.' });
            });
        });
    });
});

//LOGIN
app.post('/api/login', (req, res) => {
    const { phone_number, password } = req.body;
    console.log('phone_number:', phone_number);
    console.log('password:', password);

    // Check if the required fields are provided
    if (!phone_number || !password) {
        return res.status(400).json({ message: 'Phone number and password are required.' });
    }

    // Retrieve the user from the database
    const getUserQuery = `SELECT * FROM users WHERE phone_number = ?`;
    pool.query(getUserQuery, [phone_number], (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid phone number or password.' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (compareError, isMatch) => {
            if (compareError) {
                console.error('Error comparing passwords:', compareError);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid phone number or password.' });
            }

            // You can generate a token (e.g., JWT) here and send it as a response for authentication purposes

            req.session.userId = user.id;

            res.status(200).json({ message: 'User logged in successfully.' });
        });
    });
});

// Retrieve the user from the database based on the session
app.get('/api/user', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const getUserQuery = `SELECT * FROM users WHERE id = ?`;
    pool.query(getUserQuery, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = results[0];
        res.status(200).json({ name: user.name });
    });
});

// Logout: Clear the session
app.post('/api/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error logging out:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        res.status(200).json({ message: 'Logged out successfully.' });
    });
});

// FETCH GROUP
app.get('/api/groups', (req, res) => {
    // Assuming you have a MySQL connection set up

    // Query the database to fetch all groups
    pool.query('SELECT * FROM chore_group', (error, results) => {
        if (error) {
            console.error('Error fetching groups:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

// CREATE GROUP
app.post('/api/groups', (req, res) => {
    const { groupName } = req.body;

    // Assuming you have a MySQL connection set up

    // Insert the new group into the database
    pool.query(
        'INSERT INTO chore_group (name) VALUES (?)',
        [groupName],
        (error, results) => {
            if (error) {
                console.error('Error creating group:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                const groupId = results.insertId;
                res.json({ groupId, name: groupName });
            }
        }
    );
});

// JOIN EXISTING GROUP
app.post('/api/groups/join', (req, res) => {
    const { groupId, userId } = req.body;

    pool.query('UPDATE users SET group_id = ? WHERE id = ?', [groupId, userId], (err) => {
        if (err) {
            console.error('Error joining group:', err);
            res.status(500).json({ message: 'Failed to join group' });
        } else {
            res.status(200).json({ message: 'Joined group successfully' });
        }
    });
});

// LEAVE GROUP
app.post('/api/groups/leave', (req, res) => {
    const { userId } = req.body;

    pool.query('UPDATE users SET group_id = NULL WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error('Error leaving group:', err);
            res.status(500).json({ message: 'Failed to leave group' });
        } else {
            res.status(200).json({ message: 'Left group successfully' });
        }
    });
});

// CREATE CHORE
app.post('/api/groups/:groupId/chores', (req, res) => {
    // Extract the chore name from the request body
    const { choreName } = req.body;
    const groupId = req.params.groupId;

    // Insert the new chore into the chores table
    pool.query('INSERT INTO chores (group_id, name) VALUES (?, ?)', [groupId, choreName], (err, result) => {
        if (err) {
            console.error('Error creating chore:', err);
            res.status(500).json({ message: 'Failed to create chore' });
        } else {
            const choreId = result.insertId;
            res.status(201).json({ choreId, message: 'Chore added successfully' });
        }
    });
});

// DELETE CHORE
app.delete('/api/groups/:groupId/chores/:choreId', (req, res) => {
    const groupId = req.params.groupId;
    const choreId = req.params.choreId;

    // Delete the chore from the chores table
    pool.query('DELETE FROM chores WHERE id = ? AND group_id = ?', [choreId, groupId], (err, result) => {
        if (err) {
            console.error('Error deleting chore:', err);
            res.status(500).json({ message: 'Failed to delete chore' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Chore not found' });
        } else {
            res.status(200).json({ message: 'Chore deleted successfully' });
        }
    });
});

// ASSIGN CHORE TO MEMBER
app.post('/api/groups/:groupId/chores/:choreId/assign', (req, res) => {
    const groupId = req.params.groupId;
    const choreId = req.params.choreId;
    const { memberId } = req.body;

    // Update the chore's assigned member in the chores table
    pool.query('UPDATE chores SET assigned_member_id = ? WHERE id = ? AND group_id = ?', [memberId, choreId, groupId], (err, result) => {
        if (err) {
            console.error('Error assigning chore:', err);
            res.status(500).json({ message: 'Failed to assign chore' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Chore not found' });
        } else {
            res.status(200).json({ message: 'Chore assigned successfully' });
        }
    });
});

// API endpoint for sending a chat message
app.post('/api/groups/:groupId/chat', (req, res) => {
    const { groupId } = req.params;
    const { message } = req.body;

    // Broadcast the chat message to all connected clients
    broadcastMessage(JSON.stringify({ groupId, message }));

    // Respond with a success message
    res.json({ message: 'Message sent successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Internal server error:', err);
    res.status(500).json({ message: 'Internal server error.' });
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Not found.' });
});

module.exports = app;