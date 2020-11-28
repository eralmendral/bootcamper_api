const express = require('express');
const app = express();
const connectDB = require('./config/db');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser')

// security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

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

// Cookie parser
app.use(cookieParser());

// Routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

/// File uploading
app.use(fileupload());

// Security
app.use(mongoSanitize());   // sanitize data
app.use(helmet());       // additional security headers
app.use(xssClean());  // prevent malicious script code injection
app.use(hpp());      // prevent http param pollution
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 500
})
app.use(limiter);
app.use(cors()); // Enable CORS
 
// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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