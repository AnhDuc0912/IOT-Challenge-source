const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./src/config/database')

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
console.log(process.env.MONGO_URI);
connectDB()

// Schema sản phẩm
const routes = require('./src/routes');
app.use('/api', routes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));