import { Scenario } from "../models/scenario.model.js";
import { GameType } from "../models/gameType.model.js";
import { ScenarioConfig } from "../models/scenarioConfig.model.js";

// Scenario Controllers
export const getAllScenarios = async (req, res) => {
    try {
        const scenarios = await Scenario.find().sort({ order: 1 });
        return res.status(200).json({
            scenarios,
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

export const getScenarioById = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const scenario = await Scenario.findById(scenarioId);
        
        if (!scenario) {
            return res.status(404).json({
                message: "Scenario not found",
                success: false,
            });
        }
        
        return res.status(200).json({
            scenario,
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

export const createScenario = async (req, res) => {
    try {
        const { name, description, order, mapPosition, storyContext, availableLevels, isRequired } = req.body;
        
        if (!name || !description || !order || !mapPosition || !storyContext) {
            return res.status(400).json({
                message: "Required fields are missing",
                success: false,
            });
        }
        
        const scenario = await Scenario.create({
            name,
            description,
            order,
            mapPosition,
            storyContext,
            availableLevels: availableLevels || ['A1', 'A2', 'B1', 'B2'],
            isRequired: isRequired !== undefined ? isRequired : true
        });
        
        return res.status(201).json({
            message: "Scenario created successfully",
            scenario,
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

// Game Type Controllers
export const getAllGameTypes = async (req, res) => {
    try {
        const gameTypes = await GameType.find({ isActive: true });
        return res.status(200).json({
            gameTypes,
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

export const createGameType = async (req, res) => {
    try {
        const { name, description, componentName, configOptions, isActive } = req.body;
        
        if (!name || !description || !componentName) {
            return res.status(400).json({
                message: "Required fields are missing",
                success: false,
            });
        }
        
        const gameType = await GameType.create({
            name,
            description,
            componentName,
            configOptions: configOptions || {},
            isActive: isActive !== undefined ? isActive : true
        });
        
        return res.status(201).json({
            message: "Game type created successfully",
            gameType,
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

// Scenario Configuration Controllers
export const getScenarioConfigs = async (req, res) => {
    try {
        const configs = await ScenarioConfig.find({ isActive: true })
            .populate('scenario')
            .populate('gameType');
        
        return res.status(200).json({
            configs,
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

export const createScenarioConfig = async (req, res) => {
    try {
        const { scenarioId, gameTypeId, difficultyLevel, gameConfig, instructions, isActive } = req.body;
        
        if (!scenarioId || !gameTypeId || !difficultyLevel) {
            return res.status(400).json({
                message: "Required fields are missing",
                success: false,
            });
        }
        
        const config = await ScenarioConfig.create({
            scenario: scenarioId,
            gameType: gameTypeId,
            difficultyLevel,
            gameConfig: gameConfig || {},
            instructions: instructions || '',
            isActive: isActive !== undefined ? isActive : true
        });
        
        await config.populate(['scenario', 'gameType']);
        
        return res.status(201).json({
            message: "Scenario configuration created successfully",
            config,
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

export const updateScenarioConfig = async (req, res) => {
    try {
        const { configId } = req.params;
        const { gameTypeId, gameConfig, instructions, isActive } = req.body;
        
        const config = await ScenarioConfig.findByIdAndUpdate(
            configId,
            {
                ...(gameTypeId && { gameType: gameTypeId }),
                ...(gameConfig && { gameConfig }),
                ...(instructions !== undefined && { instructions }),
                ...(isActive !== undefined && { isActive })
            },
            { new: true }
        ).populate(['scenario', 'gameType']);
        
        if (!config) {
            return res.status(404).json({
                message: "Configuration not found",
                success: false,
            });
        }
        
        return res.status(200).json({
            message: "Scenario configuration updated successfully",
            config,
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

export const updateScenario = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const { name, description, mapPosition, storyContext, availableLevels, isRequired } = req.body;
        
        const scenario = await Scenario.findByIdAndUpdate(
            scenarioId,
            {
                ...(name && { name }),
                ...(description && { description }),
                ...(mapPosition && { mapPosition }),
                ...(storyContext && { storyContext }),
                ...(availableLevels && { availableLevels }),
                ...(isRequired !== undefined && { isRequired })
            },
            { new: true }
        );
        
        if (!scenario) {
            return res.status(404).json({
                message: "Scenario not found",
                success: false,
            });
        }
        
        return res.status(200).json({
            message: "Scenario updated successfully",
            scenario,
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