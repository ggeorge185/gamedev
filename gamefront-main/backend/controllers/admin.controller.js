import { GameDeployment } from "../models/gameDeployment.model.js";
import { GameUser } from "../models/gameUser.model.js";

// Get all game deployments
export const getGameDeployments = async (req, res) => {
    try {
        const deployments = await GameDeployment.find({ isActive: true })
            .populate('createdBy', 'username email')
            .sort({ scenario: 1, level: 1 });

        return res.status(200).json({
            success: true,
            deployments
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get available games for a specific scenario and level
export const getAvailableGames = async (req, res) => {
    try {
        const { scenario, level } = req.params;

        if (!['accommodation', 'city_registration', 'university', 'banking', 'everyday_items'].includes(scenario)) {
            return res.status(400).json({
                message: "Invalid scenario",
                success: false
            });
        }

        if (!['A1', 'A2', 'B1', 'B2'].includes(level)) {
            return res.status(400).json({
                message: "Invalid level",
                success: false
            });
        }

        const deployment = await GameDeployment.findOne({ 
            scenario, 
            level, 
            isActive: true 
        });

        if (!deployment) {
            // Return default games if no deployment is configured
            const defaultGames = [
                { gameType: 'memory', isActive: true, maxScore: 100, timeLimit: 10 },
                { gameType: 'scrabble', isActive: true, maxScore: 100, timeLimit: 15 },
                { gameType: 'anagrams', isActive: true, maxScore: 100, timeLimit: 8 }
            ];

            return res.status(200).json({
                success: true,
                availableGames: defaultGames
            });
        }

        const activeGames = deployment.availableGames.filter(game => game.isActive);

        return res.status(200).json({
            success: true,
            availableGames: activeGames
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Create or update game deployment
export const createGameDeployment = async (req, res) => {
    try {
        const { scenario, level, availableGames } = req.body;
        const userId = req.id;

        if (!['accommodation', 'city_registration', 'university', 'banking', 'everyday_items'].includes(scenario)) {
            return res.status(400).json({
                message: "Invalid scenario",
                success: false
            });
        }

        if (!['A1', 'A2', 'B1', 'B2'].includes(level)) {
            return res.status(400).json({
                message: "Invalid level",
                success: false
            });
        }

        if (!availableGames || !Array.isArray(availableGames) || availableGames.length === 0) {
            return res.status(400).json({
                message: "At least one game must be configured",
                success: false
            });
        }

        // Validate game types
        const validGameTypes = ['memory', 'scrabble', 'anagrams', 'quiz', 'taboo', 'jumbled_letters'];
        for (const game of availableGames) {
            if (!validGameTypes.includes(game.gameType)) {
                return res.status(400).json({
                    message: `Invalid game type: ${game.gameType}`,
                    success: false
                });
            }
        }

        // Check if deployment already exists
        let deployment = await GameDeployment.findOne({ scenario, level });

        if (deployment) {
            // Update existing deployment
            deployment.availableGames = availableGames;
            deployment.isActive = true;
            await deployment.save();
        } else {
            // Create new deployment
            deployment = new GameDeployment({
                scenario,
                level,
                availableGames,
                createdBy: userId
            });
            await deployment.save();
        }

        return res.status(200).json({
            message: "Game deployment configured successfully",
            success: true,
            deployment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Delete game deployment
export const deleteGameDeployment = async (req, res) => {
    try {
        const { id } = req.params;

        const deployment = await GameDeployment.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!deployment) {
            return res.status(404).json({
                message: "Game deployment not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Game deployment deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};