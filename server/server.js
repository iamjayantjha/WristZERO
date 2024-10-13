const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Watch = require('./models/Watch');

const app = express();
const PORT = process.env.PORT || 5001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    items: [
        {
            watchId: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Q5 to Populate the database is below
app.post('/api/watches', async (req, res) => {
    const watch = new Watch(req.body);
    try {
        const savedWatch = await watch.save();
        res.status(201).json(savedWatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/watches/:id', async (req, res) => {
    try {
        const updatedWatch = await Watch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWatch) return res.status(404).json({ message: "Watch not found" });
        res.json(updatedWatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a watch
app.delete('/api/watches/:id', async (req, res) => {
    try {
        const deletedWatch = await Watch.findByIdAndDelete(req.params.id);
        if (!deletedWatch) return res.status(404).json({ message: "Watch not found" });
        res.json({ message: "Watch deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/watches', async (req, res) => {
    try {
        const watches = await Watch.find();
        res.json(watches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/checkout', authMiddleware, async (req, res) => {
    const { items, totalAmount } = req.body;

    if (!items || !totalAmount) {
        return res.status(400).json({ message: 'Items and total amount are required.' });
    }

    try {
        const order = new Order({
            items,
            totalAmount,
            userId: req.user.userId
        });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully.', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order. Please try again later.' });
    }
});

app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.user.email}` });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});