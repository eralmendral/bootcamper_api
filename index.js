const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Configs
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env'})

// Routes
const bootcamps = require('./routes/bootcamps')

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);


// Body parser
app.use(express.json());

// Database connection
connectDB();

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`Env:`, process.env.NODE_ENV)
  console.log(`Server running at port: ${port}`)
})

// Handle errors
process.on('unhandledRejection', (err, promise) => {
  console.log('Error:', err.message)
  // Close server and exit process
  server.close(() => process.exit(1));
})