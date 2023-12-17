import dotenv from "dotenv";
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import cloudinary from "cloudinary";
import routes from "./routes/index.js"; // Ensure the routes file is using ES6 exports

const app = express();
const router = express.Router();

const uri = process.env.MONGODB_URI;
let port = process.env.PORT || 5001;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());


routes(router);
app.use("/api", router);

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
  });
