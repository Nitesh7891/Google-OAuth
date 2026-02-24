import express from 'express';
import { authRouter } from './routes/auth.routes.js';
import { connectDB } from './db/db.js';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config({
    path:'/.env'
});

const app=express();

const PORT=process.env.PORT || 8080;

app.use(cors({origin:"http://localhost:5173",credentials:true}));

app.use('/auth',authRouter);
app.get('/',(req,res)=>{
   console.log('Hello World');
   res.send('Hello World');
});


connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.log("Error connecting to database:", error);
});