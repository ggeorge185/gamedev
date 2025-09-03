import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getUserProgress,
    updateUserLevel,
    completeGame,
    unlockScenario
} from "../controllers/game.controller.js";

const router = express.Router();

router.get("/progress", isAuthenticated, getUserProgress);
router.put("/level", isAuthenticated, updateUserLevel);
router.post("/complete", isAuthenticated, completeGame);
router.post("/unlock-scenario", isAuthenticated, unlockScenario);

export default router;