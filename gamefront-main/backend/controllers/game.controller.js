import { GameUser } from "../models/gameUser.model.js";

// Get user progress
export const getUserProgress = async (req, res) => {
    try {
        const userId = req.id;
        const user = await GameUser.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            progress: {
                currentLevel: user.currentLevel,
                completedScenarios: user.completedScenarios,
                totalScore: user.totalScore,
                achievements: user.achievements,
                storyModeProgress: user.storyModeProgress
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Update user level
export const updateUserLevel = async (req, res) => {
    try {
        const userId = req.id;
        const { level } = req.body;

        if (!['A1', 'A2', 'B1', 'B2'].includes(level)) {
            return res.status(400).json({
                message: "Invalid level",
                success: false
            });
        }

        const user = await GameUser.findByIdAndUpdate(
            userId,
            { currentLevel: level },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            message: `Level updated to ${level}`,
            success: true,
            user: {
                currentLevel: user.currentLevel
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Complete a game in a scenario
export const completeGame = async (req, res) => {
    try {
        const userId = req.id;
        const { scenario, level, gameType, score } = req.body;

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

        if (!['jumbled_letters', 'taboo', 'quiz', 'memory_game', 'memory', 'scrabble', 'anagrams'].includes(gameType)) {
            return res.status(400).json({
                message: "Invalid game type",
                success: false
            });
        }

        const user = await GameUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Find or create scenario progress
        let scenarioProgress = user.completedScenarios.find(
            cs => cs.scenario === scenario && cs.level === level
        );

        if (!scenarioProgress) {
            scenarioProgress = {
                scenario,
                level,
                completedGames: [],
                completedAt: new Date()
            };
            user.completedScenarios.push(scenarioProgress);
        }

        // Add or update game completion
        const existingGame = scenarioProgress.completedGames.find(
            game => game.gameType === gameType
        );

        if (existingGame) {
            existingGame.score = Math.max(existingGame.score, score);
            existingGame.completedAt = new Date();
        } else {
            scenarioProgress.completedGames.push({
                gameType,
                score,
                completedAt: new Date()
            });
        }

        // Update total score
        user.totalScore += score;

        await user.save();

        // Check if scenario should be completed and unlock next one
        const shouldUnlockNext = await checkAndUnlockNextScenario(user, scenario, level);
        let unlockedScenario = null;
        
        if (shouldUnlockNext) {
            unlockedScenario = await unlockNextScenario(user, scenario);
        }

        return res.status(200).json({
            message: "Game completed successfully!",
            success: true,
            progress: {
                scenario,
                level,
                gameType,
                score,
                totalScore: user.totalScore,
                unlockedScenario
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Unlock next scenario in story mode
export const unlockScenario = async (req, res) => {
    try {
        const userId = req.id;
        const { scenario } = req.body;

        if (!['accommodation', 'city_registration', 'university', 'banking', 'everyday_items'].includes(scenario)) {
            return res.status(400).json({
                message: "Invalid scenario",
                success: false
            });
        }

        const user = await GameUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (!user.storyModeProgress.unlockedScenarios.includes(scenario)) {
            user.storyModeProgress.unlockedScenarios.push(scenario);
            await user.save();
        }

        return res.status(200).json({
            message: `${scenario} scenario unlocked!`,
            success: true,
            unlockedScenarios: user.storyModeProgress.unlockedScenarios
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Helper function to check if next scenario should be unlocked
const checkAndUnlockNextScenario = async (user, currentScenario, level) => {
    // Find completed games for current scenario
    const scenarioProgress = user.completedScenarios.find(
        cs => cs.scenario === currentScenario && cs.level === level
    );
    
    if (!scenarioProgress || !scenarioProgress.completedGames) {
        return false;
    }
    
    // Check if at least 2 games are completed with decent scores
    const goodScoreGames = scenarioProgress.completedGames.filter(game => game.score >= 50);
    return goodScoreGames.length >= 2;
};

// Helper function to unlock next scenario
const unlockNextScenario = async (user, currentScenario) => {
    const scenarioOrder = ['accommodation', 'city_registration', 'university', 'banking', 'everyday_items'];
    const currentIndex = scenarioOrder.indexOf(currentScenario);
    
    if (currentIndex < 0 || currentIndex >= scenarioOrder.length - 1) {
        return null; // No next scenario or invalid scenario
    }
    
    const nextScenario = scenarioOrder[currentIndex + 1];
    
    if (!user.storyModeProgress.unlockedScenarios.includes(nextScenario)) {
        user.storyModeProgress.unlockedScenarios.push(nextScenario);
        await user.save();
        return nextScenario;
    }
    
    return null;
};