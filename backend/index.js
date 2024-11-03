// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://127.0.0.1:27017/mern-auth')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Failed to connect to MongoDB:', err));

// // User Schema and Model
// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// const User = mongoose.model('User', userSchema);

// // Signup Route
// app.post('/api/signup', async (req, res) => {
//     const { email, password, confirmPassword } = req.body;

//     // Check if passwords match
//     if (password !== confirmPassword) {
//         return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save new user
//     const newUser = new User({ email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//     console.log(`User Email is -: ${email}`);
//     console.log(`User Password is -: ${password}`);

// });

// // Login Route
// app.post('/api/signin', async (req, res) => {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(400).json({ message: 'User not found' });
//     }

//     // Check if password is correct
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Create and return a JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '5h'

//     });
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);


//     res.status(200).json({ message: 'Login successful', token });
// });

// // Protected Route Example (Home Page)
// app.get('/api/home', (req, res) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         res.status(200).json({ message: 'Welcome to the home page!' });
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// });

// // Server Listening
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const Razorpay = require("razorpay");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/mern-auth").then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

mongoose.connect(process.env.MONGODB_URI,)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));



// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);


// BankDetails Schema
const bankDetailsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    confirmAccountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
});
const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);


// Transaction Schema
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['recharge', 'withdraw'], required: true },
    date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// const authenticate = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// };



// Middleware to authenticate and set userId in req.user
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        // Verify token and get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_jwt_secret' with your actual secret key
        req.user = decoded; // decoded should have userId if encoded during login/signup
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};



// Signup Route
app.post('/signup', async (req, res) => {
    const { email, phone, password } = req.body;
    console.log(`User Email - ${email}`);
    console.log(`User Phone - ${phone}`);
    console.log(`User password - ${password}`);

    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
    }


    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user in the database
        const newUser = new User({ email, phone, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// SignIn Route
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'User signed in successfully', token });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Save Bank Details
app.post('/save', authenticate, async (req, res) => {
    const { bankName, accountNumber, confirmAccountNumber, ifscCode } = req.body;
    if (accountNumber !== confirmAccountNumber) return res.status(400).json({ message: 'Account numbers do not match.' });

    try {
        const bankDetails = new BankDetails({
            userId: req.user._id,
            bankName,
            accountNumber,
            confirmAccountNumber,
            ifscCode,
        });
        await bankDetails.save();
        res.json({ message: 'Bank details saved successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error saving bank details', error });
    }
});


// Get User Balance
app.get('/balance', authenticate, async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id });
    const balance = transactions.reduce((acc, txn) => txn.type === 'recharge' ? acc + txn.amount : acc - txn.amount, 0);
    res.json({ balance });
});

// Get Transaction History
app.get('/history', authenticate, async (req, res) => {
    const history = await Transaction.find({ userId: req.user._id });
    res.json(history);
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
