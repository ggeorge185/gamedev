import { ScenarioCollection } from "../models/scenarioCollection.model.js";
import { Scenario } from "../models/scenario.model.js";
import { User } from "../models/user.model.js";

// Get all scenario collections
export const getAllScenarioCollections = async (req, res) => {
    try {
        const { level, activeOnly } = req.query;
        
        let filter = {};
        if (level) filter.languageLevel = level;
        if (activeOnly === 'true') filter.isActive = true;

        const collections = await ScenarioCollection.find(filter)
            .populate({
                path: 'scenarios',
                populate: {
                    path: 'selectedGameId',
                    select: 'displayName gameType'
                }
            })
            .populate('author', 'username profilePicture')
            .sort({ languageLevel: 1, isDefault: -1, createdAt: -1 });

        return res.status(200).json({
            collections,
            success: true
        });

    } catch (error) {
        console.error('Error getting scenario collections:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get collections by language level
export const getCollectionsByLevel = async (req, res) => {
    try {
        const { level } = req.params;
        const { activeOnly = true } = req.query;

        const collections = await ScenarioCollection.getByLanguageLevel(level, activeOnly === 'true');

        return res.status(200).json({
            collections,
            level,
            success: true
        });

    } catch (error) {
        console.error('Error getting collections by level:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get default collection for a language level
export const getDefaultCollection = async (req, res) => {
    try {
        const { level } = req.params;

        const collection = await ScenarioCollection.getDefault(level);

        if (!collection) {
            return res.status(404).json({
                message: `No default collection found for level ${level}`,
                success: false
            });
        }

        return res.status(200).json({
            collection,
            level,
            success: true
        });

    } catch (error) {
        console.error('Error getting default collection:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get user's scenario collections
export const getUserScenarioCollections = async (req, res) => {
    try {
        const authorId = req.id;

        const collections = await ScenarioCollection.find({ author: authorId })
            .populate({
                path: 'scenarios',
                populate: {
                    path: 'selectedGameId',
                    select: 'displayName gameType'
                }
            })
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            collections,
            success: true
        });

    } catch (error) {
        console.error('Error getting user collections:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Get scenario collection by ID
export const getScenarioCollectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const collection = await ScenarioCollection.findById(id)
            .populate({
                path: 'scenarios',
                populate: [
                    {
                        path: 'selectedGameId',
                        select: 'displayName gameType difficulty'
                    },
                    {
                        path: 'author',
                        select: 'username profilePicture'
                    }
                ]
            })
            .populate('author', 'username profilePicture');

        if (!collection) {
            return res.status(404).json({
                message: 'Scenario collection not found',
                success: false
            });
        }

        return res.status(200).json({
            collection,
            success: true
        });

    } catch (error) {
        console.error('Error getting collection by ID:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Create new scenario collection
export const createScenarioCollection = async (req, res) => {
    try {
        const {
            name,
            description,
            languageLevel,
            scenarios,
            isDefault,
            targetAudience,
            difficulty,
            tags
        } = req.body;

        const authorId = req.id;

        if (!name || !languageLevel || !scenarios || scenarios.length === 0) {
            return res.status(400).json({
                message: 'Name, language level, and at least one scenario are required',
                success: false
            });
        }

        // Validate that all scenarios exist and are active
        const validScenarios = await Scenario.find({
            _id: { $in: scenarios },
            languageLevel: languageLevel,
            isActive: true
        });

        if (validScenarios.length !== scenarios.length) {
            return res.status(400).json({
                message: 'One or more scenarios are invalid or not active for this language level',
                success: false
            });
        }

        // Create the collection
        const collection = await ScenarioCollection.create({
            name: name.trim(),
            description: description?.trim() || '',
            languageLevel,
            scenarios,
            isDefault: isDefault || false,
            targetAudience: targetAudience || 'general',
            difficulty: difficulty || 'medium',
            tags: tags || [],
            author: authorId
        });

        // Calculate total estimated time
        await collection.calculateTotalTime();
        await collection.save();

        // Populate and return the created collection
        const populatedCollection = await ScenarioCollection.findById(collection._id)
            .populate({
                path: 'scenarios',
                populate: {
                    path: 'selectedGameId',
                    select: 'displayName gameType'
                }
            })
            .populate('author', 'username profilePicture');

        return res.status(201).json({
            message: 'Scenario collection created successfully',
            collection: populatedCollection,
            success: true
        });

    } catch (error) {
        console.error('Error creating scenario collection:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Update scenario collection
export const updateScenarioCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            languageLevel,
            scenarios,
            isActive,
            isDefault,
            targetAudience,
            difficulty,
            tags
        } = req.body;

        const authorId = req.id;

        const collection = await ScenarioCollection.findById(id);
        if (!collection) {
            return res.status(404).json({
                message: 'Scenario collection not found',
                success: false
            });
        }

        // Check if user owns this collection
        if (collection.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to update this collection',
                success: false
            });
        }

        // If updating scenarios, validate them
        if (scenarios && scenarios.length > 0) {
            const validScenarios = await Scenario.find({
                _id: { $in: scenarios },
                languageLevel: languageLevel || collection.languageLevel,
                isActive: true
            });

            if (validScenarios.length !== scenarios.length) {
                return res.status(400).json({
                    message: 'One or more scenarios are invalid or not active',
                    success: false
                });
            }
        }

        // Update fields
        if (name) collection.name = name.trim();
        if (description !== undefined) collection.description = description.trim();
        if (languageLevel) collection.languageLevel = languageLevel;
        if (scenarios) collection.scenarios = scenarios;
        if (isActive !== undefined) collection.isActive = isActive;
        if (isDefault !== undefined) collection.isDefault = isDefault;
        if (targetAudience) collection.targetAudience = targetAudience;
        if (difficulty) collection.difficulty = difficulty;
        if (tags) collection.tags = tags;

        // Recalculate estimated time if scenarios changed
        if (scenarios) {
            await collection.calculateTotalTime();
        }

        await collection.save();

        // Return updated collection
        const updatedCollection = await ScenarioCollection.findById(id)
            .populate({
                path: 'scenarios',
                populate: {
                    path: 'selectedGameId',
                    select: 'displayName gameType'
                }
            })
            .populate('author', 'username profilePicture');

        return res.status(200).json({
            message: 'Scenario collection updated successfully',
            collection: updatedCollection,
            success: true
        });

    } catch (error) {
        console.error('Error updating scenario collection:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Delete scenario collection
export const deleteScenarioCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = req.id;

        const collection = await ScenarioCollection.findById(id);
        if (!collection) {
            return res.status(404).json({
                message: 'Scenario collection not found',
                success: false
            });
        }

        // Check if user owns this collection
        if (collection.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to delete this collection',
                success: false
            });
        }

        await ScenarioCollection.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Scenario collection deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Error deleting scenario collection:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Toggle collection status
export const toggleCollectionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = req.id;

        const collection = await ScenarioCollection.findById(id);
        if (!collection) {
            return res.status(404).json({
                message: 'Scenario collection not found',
                success: false
            });
        }

        // Check if user owns this collection
        if (collection.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to modify this collection',
                success: false
            });
        }

        collection.isActive = !collection.isActive;
        await collection.save();

        const updatedCollection = await ScenarioCollection.findById(id)
            .populate('scenarios')
            .populate('author', 'username profilePicture');

        return res.status(200).json({
            message: `Collection ${collection.isActive ? 'activated' : 'deactivated'} successfully`,
            collection: updatedCollection,
            success: true
        });

    } catch (error) {
        console.error('Error toggling collection status:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Set collection as default for its language level
export const setAsDefault = async (req, res) => {
    try {
        const { id } = req.params;
        const authorId = req.id;

        const collection = await ScenarioCollection.findById(id);
        if (!collection) {
            return res.status(404).json({
                message: 'Scenario collection not found',
                success: false
            });
        }

        // Check if user owns this collection
        if (collection.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized to modify this collection',
                success: false
            });
        }

        collection.isDefault = true;
        await collection.save(); // Pre-save middleware will handle removing default from others

        const updatedCollection = await ScenarioCollection.findById(id)
            .populate('scenarios')
            .populate('author', 'username profilePicture');

        return res.status(200).json({
            message: 'Collection set as default successfully',
            collection: updatedCollection,
            success: true
        });

    } catch (error) {
        console.error('Error setting collection as default:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};