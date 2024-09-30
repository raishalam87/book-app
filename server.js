// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to register user and address
app.post('/register', (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required.' });
    }

    // Insert user
    db.run(`INSERT INTO User (name) VALUES (?)`, [name], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to insert user.' });
        }

        const userId = this.lastID; // Get the inserted user ID

        // Insert address
        db.run(`INSERT INTO Address (user_id, address) VALUES (?, ?)`, [userId, address], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to insert address.' });
            }
            return res.status(201).json({ message: 'User and address registered successfully!' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
