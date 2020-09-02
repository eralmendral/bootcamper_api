const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env'})

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`Env:`, process.env.NODE_ENV)
  console.log(`Server running at port: ${port}`)
})