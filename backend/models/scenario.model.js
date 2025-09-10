import mongoose from "mongoose";

const scenarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Accommodation', 'City Registration', 'University related', 'Banking', 'Medical Insurance']
    },
    description: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
        unique: true
    },
    // Map position for frontend display
    mapPosition: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        }
    },
    // Story context
    storyContext: {
        type: String,
        required: true
    },
    // Available difficulty levels
    availableLevels: [{
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2']
    }],
    // Whether this scenario is required to complete story mode
    isRequired: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient searching
scenarioSchema.index({ order: 1 });
scenarioSchema.index({ name: 1 });

export const Scenario = mongoose.model('Scenario', scenarioSchema);