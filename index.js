const express = require('express');
const app = express();
require('dotenv').config(); 
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

const mpesaRoutes = require('./routes/mpesa');

main().catch(err => console.log(err));

async function main() { 
  await mongoose.connect(process.env.MONGO_URL );
  console.log("Database connected succesfully..")
}

app.use("/api", mpesaRoutes); 

app.listen(port, () => {
    console.log(`The application is running on port ${port}`);
}); 
