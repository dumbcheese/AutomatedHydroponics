import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user.js'
import readingsRoutes from './routes/readings.js'
import parametersRoutes from './routes/parameters.js'


const app = express();
dotenv.config();


app.get('/', (req, res) =>{
    res.send('Automated Hydroponics')
});

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use('/user', userRoutes);
app.use('/readings', readingsRoutes);
app.use('/parameters', parametersRoutes);




// const CONNECTION_URL = 'connection URI for Atlas'
const PORT = 5001;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
 .then(()=> app.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`)))
 .catch((error)=> console.log(error.message));

 mongoose.set('useFindAndModify', false);
