import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
<<<<<<< HEAD
import userRoute from "./routes/user.route.js";
import wordRoute from "./routes/word.route.js";
import gameRoute from "./routes/game.route.js";
import scenarioRoute from "./routes/scenario.route.js";
import scenarioCollectionRoute from "./routes/scenarioCollection.route.js";
import gamePlayRoute from "./routes/gamePlay.route.js";
import path from "path";
 
=======
import userRoute from "./routes/user.route.js";
import wordRoute from "./routes/word.route.js";
import gameUserRoute from "./routes/gameUser.route.js";
import gameRoute from "./routes/game.route.js";
import path from "path";
import miniGameRoutes from "./routes/miniGameRoutes.js";

>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
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

<<<<<<< HEAD
// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/word", wordRoute);
app.use("/api/v1/game", gameRoute);
app.use("/api/v1/scenario", scenarioRoute);
app.use("/api/v1/scenario-collection", scenarioCollectionRoute);
app.use("/api/v1/gameplay", gamePlayRoute);
=======
// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/word", wordRoute);
app.use("/api/v1/gameuser", gameUserRoute);
app.use("/api/v1/game", gameRoute);
app.use("/api/minigames", miniGameRoutes); // <-- moved to after express() is created
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});
<<<<<<< HEAD

=======
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
