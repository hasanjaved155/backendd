const express = require('express');
const dotenv = require('dotenv');
const connecDB = require('./config/db');

const authRoutes = require('./routes/authRoutes')

dotenv.config();

connecDB();
const app = express();
app.use(express.json());



app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('server is connected')
})



const Port = process.env.PORT || 8080;

app.listen(Port, () => {
    console.log(`server start at ${Port}`)
})