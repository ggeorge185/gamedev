import mongoose from "mongoose";

const scenarioConfigSchema = new mongoose.Schema({
    scenario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scenario',
        required: true
    },
    gameType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameType',
        required: true
    },
    difficultyLevel: {
        type: String,
        required: true,
        enum: ['A1', 'A2', 'B1', 'B2']
    },
    // Game-specific configuration for this scenario/difficulty combination
    gameConfig: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Whether this configuration is active
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Ensure unique combinations of scenario + difficulty level
scenarioConfigSchema.index({ scenario: 1, difficultyLevel: 1 }, { unique: true });
scenarioConfigSchema.index({ gameType: 1 });
scenarioConfigSchema.index({ isActive: 1 });

export const ScenarioConfig = mongoose.model('ScenarioConfig', scenarioConfigSchema);