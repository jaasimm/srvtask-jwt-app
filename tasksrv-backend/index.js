const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB=require('./DB/Connection')
require('dotenv').config();

 const DB = require('./DB/Connection');
 const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

 connectDB();

 app.use('/api', authRoutes);
app.use('/api', protectedRoutes);

app.listen(5000, () => console.log('Server started on port 5000'));
app.get('/',(req,res)=>{
    res.send("welcome to serverapp")
})