import mongoose from "mongoose";

const gameUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    // Progress tracking
    storyModeCompleted: {
        type: Boolean,
        default: false
    },
    completedScenarios: [{
        scenarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Scenario'
        },
        difficultyLevel: {
            type: String,
            enum: ['A1', 'A2', 'B1', 'B2']
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

// Index for efficient searching
gameUserSchema.index({ email: 1 });
gameUserSchema.index({ username: 1 });

export const GameUser = mongoose.model('GameUser', gameUserSchema);