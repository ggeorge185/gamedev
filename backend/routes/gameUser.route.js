import express from "express";
import { register, login, logout, getProfile } from "../controllers/gameUser.controller.js";
import isGameUserAuthenticated from "../middlewares/isGameUserAuthenticated.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isGameUserAuthenticated, getProfile);

export default router;