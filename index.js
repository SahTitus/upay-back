import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { connectDB } from "./config/connectDb.js";
import dotenv from "dotenv";
import credentials from "./middleware/credentials.js";
import userRoutes from "./routes/users.js";


const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());

app.use((req,res, next)=>{
 
  res.header("Access-Control-Allow-Origin", "https://upay-sooty.vercel.app");
res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
res.setHeader('Access-Control-Allow-Origin',"*");
res.setHeader('Access-Control-Allow-Headers',"*");
res.header('Access-Control-Allow-Credentials', true);
next();
});

// app.use(credentials);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());



app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", userRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB 😆");
  app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
});
