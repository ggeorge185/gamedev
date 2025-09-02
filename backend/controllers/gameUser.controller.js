import { GameUser } from "../models/gameUser.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        
        // Check if user already exists
        const existingUser = await GameUser.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(401).json({
                message: "Email or username already exists",
                success: false,
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await GameUser.create({
            username,
            email,
            password: hashedPassword
        });
        
        return res.status(201).json({
            message: "Game account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        
        let gameUser = await GameUser.findOne({ email }).populate('completedScenarios.scenarioId');
        if (!gameUser) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, gameUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        
        const token = await jwt.sign({ gameUserId: gameUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // Return user data without password
        gameUser = {
            _id: gameUser._id,
            username: gameUser.username,
            email: gameUser.email,
            storyModeCompleted: gameUser.storyModeCompleted,
            completedScenarios: gameUser.completedScenarios
        };
        
        return res.cookie('gameToken', token, { 
            httpOnly: true, 
            sameSite: 'strict', 
            maxAge: 1 * 24 * 60 * 60 * 1000 
        }).json({
            message: `Welcome back ${gameUser.username}!`,
            success: true,
            gameUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("gameToken", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const gameUserId = req.params.id;
        let gameUser = await GameUser.findById(gameUserId).populate('completedScenarios.scenarioId');
        
        if (!gameUser) {
            return res.status(404).json({
                message: "Game user not found",
                success: false
            });
        }
        
        // Remove password from response
        gameUser = {
            _id: gameUser._id,
            username: gameUser.username,
            email: gameUser.email,
            storyModeCompleted: gameUser.storyModeCompleted,
            completedScenarios: gameUser.completedScenarios,
            createdAt: gameUser.createdAt
        };
        
        return res.status(200).json({
            gameUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};