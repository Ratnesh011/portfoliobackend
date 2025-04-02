const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/ProjectRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan'); 

dotenv.config();

const app = express();


connectDB();





app.use(cors());


app.use(express.json());
app.use(morgan('dev')); 


app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000; //if port not find in .env file then it runs on 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});