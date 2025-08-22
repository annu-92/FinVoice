const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'finvoice_db',
    password: 'your_password_here', // Change this to your actual password
    port: 5432,
});

// Create users table if it doesn't exist
async function createTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                date_of_birth DATE,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(query);
        console.log('Users table created or already exists');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Initialize database
createTable();

// API Routes
app.post('/api/check-user', async (req, res) => {
    try {
        const { email } = req.body;
        const query = 'SELECT id FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        
        res.json({ exists: result.rows.length > 0 });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/create-user', async (req, res) => {
    try {
        const { name, dateOfBirth, email, phoneNumber } = req.body;
        const query = `
            INSERT INTO users (name, date_of_birth, email, phone_number)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const result = await pool.query(query, [name, dateOfBirth, email, phoneNumber]);
        
        res.json({ success: true, userId: result.rows[0].id });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'User with this email already exists' });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
});

app.post('/api/login-user', async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        const query = 'SELECT id, name FROM users WHERE email = $1 AND phone_number = $2';
        const result = await pool.query(query, [email, phoneNumber]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure PostgreSQL is running and update the password in server.js');
});
