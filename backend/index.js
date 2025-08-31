import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import wordRoute from "./routes/word.route.js";
import path from "path";
import miniGameRoutes from "./routes/miniGameRoutes.js";
app.use("/api/minigames", miniGameRoutes);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "https://gamedev-2jld.onrender.com",
    credentials: true
}
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/word", wordRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});


