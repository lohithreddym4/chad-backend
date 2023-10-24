const cors=require('cors')
const connectToMongo=require('./db');
const express=require('express');
const app=express();
app.use(cors());
app.use(express.json());
connectToMongo();
const port=5000;
app.use('/auth',require('./Routes/auth'));
app.use('/chat',require('./Routes/chat'));
app.listen(port,()=>{
    console.log(`Port:${port}`);
})