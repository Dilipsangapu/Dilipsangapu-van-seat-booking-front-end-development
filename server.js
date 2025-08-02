const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Sample data
let users = [];
let vans = [
    { id: 1, name: 'Van 1', seats: 10 },
    { id: 2, name: 'Van 2', seats: 8 },
    { id: 3, name: 'Van 3', seats: 12 },
];
let bookings = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// User signup
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users.push({ email, password });
    res.status(200).json({ message: 'Signup successful' });
});

// User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
});

// Get vans
app.get('/vans', (req, res) => {
    res.status(200).json(vans);
});

// Get available seats for a van
app.get('/vans/:id/seats', (req, res) => {
    const vanId = parseInt(req.params.id);
    const van = vans.find(v => v.id === vanId);
    if (!van) {
        return res.status(404).json({ message: 'Van not found' });
    }
    const bookedSeats = bookings
        .filter(booking => booking.vanId === vanId)
        .map(booking => booking.seatNumber);
    const availableSeats = Array.from({ length: van.seats }, (_, i) => i + 1).filter(
        seat => !bookedSeats.includes(seat)
    );
    res.status(200).json({ availableSeats });
});

// Book a seat
app.post('/book', (req, res) => {
    const { vanId, seatNumber, email } = req.body;
    if (!email || !vanId || !seatNumber) {
        return res.status(400).json({ message: 'Invalid request data' });
    }
    if (bookings.some(b => b.vanId === vanId && b.seatNumber === seatNumber)) {
        return res.status(400).json({ message: 'Seat already booked' });
    }
    bookings.push({ vanId, seatNumber, email });
    res.status(200).json({ message: 'Booking successful' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
