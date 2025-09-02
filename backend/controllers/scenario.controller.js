import { Scenario } from "../models/scenario.model.js";
import { Game } from "../models/game.model.js";
import { User } from "../models/user.model.js";

// Create new scenario
export const createScenario = async (req, res) => {
    try {
        const {
            name,
            story,
            topic,
            selectedGameId,
            languageLevel,
            sequence,
            isActive,
            estimatedDuration,
            difficulty
        } = req.body;

        const authorId = req.id;

        // Validate required fields
        if (!name || !story || !topic || !selectedGameId) {
            return res.status(400).json({
                message: 'Name, story, topic, and selected game are required',
                success: false
            });
        }

        // Validate that the selected game exists and is active
        const game = await Game.findById(selectedGameId);
        if (!game) {
            return res.status(400).json({
                message: 'Selected game does not exist',
                success: false
            });
        }

        if (!game.isActive) {
            return res.status(400).json({
                message: 'Selected game is not active',
                success: false
            });
        }

        // Check if scenario name already exists
        const existingScenario = await Scenario.findOne({ 
            name: name.trim() 
        });
        if (existingScenario) {
            return res.status(400).json({
                message: 'A scenario with this name already exists',
                success: false
            });
        }

        // Get next sequence number if not provided
        let scenarioSequence = sequence;
        if (!scenarioSequence) {
            scenarioSequence = await Scenario.getNextSequence();
        }

        const scenario = await Scenario.create({
            name: name.trim(),
            story: story.trim(),
            topic: topic.trim(),
            selectedGameId,
            languageLevel: languageLevel || 'A1',
            sequence: scenarioSequence,
            isActive: isActive !== undefined ? isActive : true,
            estimatedDuration: estimatedDuration || 10,
            difficulty: difficulty || 'medium',
            author: authorId
        });

        const populatedScenario = await Scenario.findById(scenario._id)
            .populate({
                path: 'selectedGameId',
                select: '-author' // Exclude author from game details
            })
            .populate({
                path: 'author',
                select: '-password'
            });

        return res.status(201).json({
            message: 'Scenario created successfully',
            scenario: populatedScenario,
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

// Get all scenarios sorted by sequence
export const getAllScenarios = async (req, res) => {
    try {
        const { 
            topic, 
            languageLevel, 
            difficulty, 
            isActive,
            gameType 
        } = req.query;

        let filter = {};
        
        if (topic) filter.topic = { $regex: topic, $options: 'i' };
        if (languageLevel) filter.languageLevel = languageLevel;
        if (difficulty) filter.difficulty = difficulty;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        let scenarios = await Scenario.find(filter)
            .populate({
                path: 'selectedGameId',
                select: 'name displayName gameType difficulty isActive'
            })
            .populate({
                path: 'author',
                select: '-password'
            })
            .sort({ sequence: 1 });

        // Filter by game type if specified
        if (gameType) {
            scenarios = scenarios.filter(scenario => 
                scenario.selectedGameId && scenario.selectedGameId.gameType === gameType
            );
        }

        return res.status(200).json({
            scenarios,
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

// Get active scenarios only
export const getActiveScenarios = async (req, res) => {
    try {
        const scenarios = await Scenario.find({ isActive: true })
            .populate({
                path: 'selectedGameId',
                match: { isActive: true }, // Only populate active games
                select: 'name displayName gameType difficulty'
            })
            .populate({
                path: 'author',
                select: '-password'
            })
            .sort({ sequence: 1 });

        // Filter out scenarios with inactive games
        const activeScenarios = scenarios.filter(scenario => scenario.selectedGameId);

        return res.status(200).json({
            scenarios: activeScenarios,
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

// Get scenarios by user
export const getUserScenarios = async (req, res) => {
    try {
        const authorId = req.id;
        const scenarios = await Scenario.find({ author: authorId })
            .populate({
                path: 'selectedGameId',
                select: 'name displayName gameType difficulty isActive'
            })
            .populate({
                path: 'author',
                select: '-password'
            })
            .sort({ sequence: 1 });

        return res.status(200).json({
            scenarios,
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

// Get single scenario by ID with populated game details
export const getScenarioById = async (req, res) => {
    try {
        const scenarioId = req.params.id;
        
        const scenario = await Scenario.findById(scenarioId)
            .populate({
                path: 'selectedGameId',
                populate: {
                    path: 'author',
                    select: '-password'
                }
            })
            .populate({
                path: 'author',
                select: '-password'
            });

        if (!scenario) {
            return res.status(404).json({
                message: 'Scenario not found',
                success: false
            });
        }

        return res.status(200).json({
            scenario,
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

// Update scenario
export const updateScenario = async (req, res) => {
    try {
        const scenarioId = req.params.id;
        const authorId = req.id;
        const updateData = req.body;

        const scenario = await Scenario.findById(scenarioId);
        if (!scenario) {
            return res.status(404).json({
                message: 'Scenario not found',
                success: false
            });
        }

        // Check if user owns this scenario
        if (scenario.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to update this scenario',
                success: false
            });
        }

        // If updating name, check for uniqueness
        if (updateData.name && updateData.name.trim() !== scenario.name) {
            const existingScenario = await Scenario.findOne({ 
                name: updateData.name.trim(),
                _id: { $ne: scenarioId }
            });
            if (existingScenario) {
                return res.status(400).json({
                    message: 'A scenario with this name already exists',
                    success: false
                });
            }
        }

        // If updating selectedGameId, validate the game
        if (updateData.selectedGameId && updateData.selectedGameId !== scenario.selectedGameId.toString()) {
            const game = await Game.findById(updateData.selectedGameId);
            if (!game) {
                return res.status(400).json({
                    message: 'Selected game does not exist',
                    success: false
                });
            }
            if (!game.isActive) {
                return res.status(400).json({
                    message: 'Selected game is not active',
                    success: false
                });
            }
        }

        // Handle sequence updates specially
        if (updateData.sequence && updateData.sequence !== scenario.sequence) {
            await scenario.moveToSequence(updateData.sequence);
            // Remove sequence from updateData since it's already handled
            delete updateData.sequence;
        }

        // Clean the update data
        const cleanedData = {};
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                if (typeof updateData[key] === 'string') {
                    cleanedData[key] = updateData[key].trim();
                } else {
                    cleanedData[key] = updateData[key];
                }
            }
        });

        const updatedScenario = await Scenario.findByIdAndUpdate(
            scenarioId,
            cleanedData,
            { new: true, runValidators: true }
        ).populate({
            path: 'selectedGameId',
            select: 'name displayName gameType difficulty isActive'
        }).populate({
            path: 'author',
            select: '-password'
        });

        return res.status(200).json({
            message: 'Scenario updated successfully',
            scenario: updatedScenario,
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

// Delete scenario
export const deleteScenario = async (req, res) => {
    try {
        const scenarioId = req.params.id;
        const authorId = req.id;

        const scenario = await Scenario.findById(scenarioId);
        if (!scenario) {
            return res.status(404).json({
                message: 'Scenario not found',
                success: false
            });
        }

        // Check if user owns this scenario
        if (scenario.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to delete this scenario',
                success: false
            });
        }

        await scenario.deleteOne();

        return res.status(200).json({
            message: 'Scenario deleted successfully',
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

// Reorder scenarios - Updates sequence numbers for level ordering
export const reorderScenarios = async (req, res) => {
    try {
        const { reorderData } = req.body;
        const authorId = req.id;

        // Validate reorderData format
        if (!Array.isArray(reorderData) || reorderData.length === 0) {
            return res.status(400).json({
                message: 'Reorder data must be a non-empty array',
                success: false
            });
        }

        // Validate that all scenarios belong to the user
        const scenarioIds = reorderData.map(item => item.id);
        const scenarios = await Scenario.find({
            _id: { $in: scenarioIds },
            author: authorId
        });

        if (scenarios.length !== scenarioIds.length) {
            return res.status(403).json({
                message: 'You can only reorder your own scenarios',
                success: false
            });
        }

        // Perform reordering
        await Scenario.reorderScenarios(reorderData);

        // Return updated scenarios
        const updatedScenarios = await Scenario.find({
            _id: { $in: scenarioIds }
        }).populate({
            path: 'selectedGameId',
            select: 'name displayName gameType difficulty'
        }).sort({ sequence: 1 });

        return res.status(200).json({
            message: 'Scenarios reordered successfully',
            scenarios: updatedScenarios,
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

// Get scenarios by topic
export const getScenariosByTopic = async (req, res) => {
    try {
        const { topic } = req.params;
        const { languageLevel, isActive } = req.query;

        let filter = { topic: { $regex: topic, $options: 'i' } };
        
        if (languageLevel) filter.languageLevel = languageLevel;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const scenarios = await Scenario.find(filter)
            .populate({
                path: 'selectedGameId',
                select: 'name displayName gameType difficulty isActive'
            })
            .populate({
                path: 'author',
                select: '-password'
            })
            .sort({ sequence: 1 });

        return res.status(200).json({
            scenarios,
            topic,
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

// Toggle scenario active status
export const toggleScenarioStatus = async (req, res) => {
    try {
        const scenarioId = req.params.id;
        const authorId = req.id;

        const scenario = await Scenario.findById(scenarioId);
        if (!scenario) {
            return res.status(404).json({
                message: 'Scenario not found',
                success: false
            });
        }

        // Check if user owns this scenario
        if (scenario.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to modify this scenario',
                success: false
            });
        }

        const updatedScenario = await Scenario.findByIdAndUpdate(
            scenarioId,
            { isActive: !scenario.isActive },
            { new: true }
        ).populate({
            path: 'selectedGameId',
            select: 'name displayName gameType difficulty'
        }).populate({
            path: 'author',
            select: '-password'
        });

        return res.status(200).json({
            message: `Scenario ${updatedScenario.isActive ? 'activated' : 'deactivated'} successfully`,
            scenario: updatedScenario,
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