const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('colors');
require('dotenv').config();

//rest object
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  return res.status(200).send("<h1>WELCOME to Restaurant app</h1>")
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server Running at port:".bold.green, `${PORT}`.blue);
})