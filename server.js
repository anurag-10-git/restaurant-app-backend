const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('colors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//rest object
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server Running at port:".bold.green, `${PORT}`.blue);
  })
})