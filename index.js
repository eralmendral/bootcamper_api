const express = require('express');
const app = express();
const connectDB = require('./config/db');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
// Configs
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env'})

// Middlewares
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('development'));
}

// Database connection
connectDB();

// Body parser
app.use(express.json());

// Routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

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