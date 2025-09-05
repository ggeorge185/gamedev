import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";

// Create a new game
export const createGame = async (req, res) => {
    try {
        const {
            name,
            displayName,
            description,
            minWords,
            maxWords,
            timeLimit,
            instructions,
            gameType,
            isActive,
            difficulty
        } = req.body;

        const authorId = req.id;

        if (!name || !displayName || !description || !instructions || !gameType) {
            return res.status(400).json({
                message: 'Name, display name, description, instructions, and game type are required',
                success: false
            });
        }

        // Check if game name already exists
        const existingGame = await Game.findOne({ name: name.toLowerCase() });
        if (existingGame) {
            return res.status(400).json({
                message: 'A game with this name already exists',
                success: false
            });
        }

        const game = await Game.create({
            name: name.toLowerCase(),
            displayName: displayName.trim(),
            description: description.trim(),
            minWords: minWords || 5,
            maxWords: maxWords || 10,
            timeLimit: timeLimit || 300,
            instructions: instructions.trim(),
            gameType,
            isActive: isActive !== undefined ? isActive : true,
            difficulty: difficulty || 'medium',
            author: authorId
        });

        const populatedGame = await Game.findById(game._id).populate({
            path: 'author',
            select: '-password'
        });

        return res.status(201).json({
            message: 'Game created successfully',
            game: populatedGame,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            success: false
        });
    }
};

// Get all games
export const getAllGames = async (req, res) => {
    try {
        const { gameType, isActive, difficulty } = req.query;
        let filter = {};

        if (gameType) filter.gameType = gameType;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (difficulty) filter.difficulty = difficulty;

        const games = await Game.find(filter)
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            games,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get active games only
export const getActiveGames = async (req, res) => {
    try {
        const games = await Game.find({ isActive: true })
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            games,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get games by user
export const getUserGames = async (req, res) => {
    try {
        const authorId = req.id;
        const games = await Game.find({ author: authorId })
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            games,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get single game by ID
export const getGameById = async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId).populate({
            path: 'author',
            select: '-password'
        });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found',
                success: false
            });
        }

        return res.status(200).json({
            game,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get single game by name
export const getGameByName = async (req, res) => {
    try {
        const gameName = req.params.name;
        const game = await Game.findOne({ name: gameName.toLowerCase() }).populate({
            path: 'author',
            select: '-password'
        });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found',
                success: false
            });
        }

        return res.status(200).json({
            game,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Update game
export const updateGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const authorId = req.id;
        const updateData = req.body;

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: 'Game not found',
                success: false
            });
        }

        // Check if user owns this game
        if (game.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to update this game',
                success: false
            });
        }

        // If updating name, check for uniqueness
        if (updateData.name && updateData.name.toLowerCase() !== game.name) {
            const existingGame = await Game.findOne({ name: updateData.name.toLowerCase() });
            if (existingGame) {
                return res.status(400).json({
                    message: 'A game with this name already exists',
                    success: false
                });
            }
        }

        // Clean the update data
        const cleanedData = {};
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                if (typeof updateData[key] === 'string') {
                    cleanedData[key] = key === 'name' ? updateData[key].toLowerCase() : updateData[key].trim();
                } else {
                    cleanedData[key] = updateData[key];
                }
            }
        });

        const updatedGame = await Game.findByIdAndUpdate(
            gameId,
            cleanedData,
            { new: true, runValidators: true }
        ).populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: 'Game updated successfully',
            game: updatedGame,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            success: false
        });
    }
};

// Delete game
export const deleteGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const authorId = req.id;

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: 'Game not found',
                success: false
            });
        }

        // Check if user owns this game
        if (game.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to delete this game',
                success: false
            });
        }

        await Game.findByIdAndDelete(gameId);

        return res.status(200).json({
            message: 'Game deleted successfully',
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Search games
export const searchGames = async (req, res) => {
    try {
        const { query, gameType, difficulty, isActive } = req.query;
        let searchFilter = {};

        if (query) {
            searchFilter.$or = [
                { displayName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { gameType: { $regex: query, $options: 'i' } }
            ];
        }

        if (gameType) {
            searchFilter.gameType = gameType;
        }

        if (difficulty) {
            searchFilter.difficulty = difficulty;
        }

        if (isActive !== undefined) {
            searchFilter.isActive = isActive === 'true';
        }

        const games = await Game.find(searchFilter)
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            games,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Toggle game active status
export const toggleGameStatus = async (req, res) => {
    try {
        const gameId = req.params.id;
        const authorId = req.id;

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: 'Game not found',
                success: false
            });
        }

        // Check if user owns this game
        if (game.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to modify this game',
                success: false
            });
        }

        const updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { isActive: !game.isActive },
            { new: true }
        ).populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: `Game ${updatedGame.isActive ? 'activated' : 'deactivated'} successfully`,
            game: updatedGame,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};