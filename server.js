const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path'); // Required for resolving file paths

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.static('public')); // Serve static files like the HTML and CSS

// Configure session middleware
app.use(
    session({
        secret: '4e709ff2e7b49f44a8d2a29c19c728ca5983c1f62de9d85a8a3e7c9f61f44b2a',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Use `secure: true` in production with HTTPS
    })
);

// Dummy database
const users = {
    User: bcrypt.hashSync('5011b0b47601bc2ec3e60880de333caf7f86b97f2b25b00feb8fedaaf19b59da', 12), // Replace with your own hashed password
};

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        return res.status(400).json({ error: 'Invalid Login Key!' });
    }

    const isMatch = await bcrypt.compare(password, users[username]);
    if (isMatch) {
        req.session.authenticated = true;
        req.session.username = username;
        return res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
    } else {
        return res.status(400).json({ error: 'Invalid Login Key!' });
    }
});

// Protected route
app.get('/dashboard', (req, res) => {
    if (req.session.authenticated) {
        return res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
    }
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
