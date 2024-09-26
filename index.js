// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const bodyParser = require('body-parser');
const cors = require("cors");

// Create an instance of express
const app = express();
const PORT = 6101;
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log(`Connected to MongoDB: ${process.env.MONGO_DB}`)

})
.catch(err => console.error('Could not connect to MongoDB', err));


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use("/",router)