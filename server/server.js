const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const cookieParser = require('cookie-parser');
const connectToMongoDb = require('./connection'); 

require('dotenv').config();


const app = express();

// Connect to MongoDB
connectToMongoDb(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Updated CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000", // Local development
    "https://social-buzz-1010.vercel.app", 
    "https://socialmedia-mfvi.onrender.com"
  ],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization' , 'Cookie'],
  exposedHeaders: ['Set-Cookie'], 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));