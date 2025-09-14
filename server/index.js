import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/userRoutes.js';

dotenv.config()
const app = express();

const port = 4000;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use(cookieparser());

app.use("/api/auth",authRouter)


app.listen(port,()=>{
    connectDB();
    console.log("running on 4000");
})
app.get('/', (req, res) => {
  res.send('API is running');
});