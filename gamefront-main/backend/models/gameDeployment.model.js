import mongoose from "mongoose";

const gameDeploymentSchema = new mongoose.Schema({
    scenario: {
        type: String,
        enum: ['accommodation', 'city_registration', 'university', 'banking', 'everyday_items'],
        required: true
    },
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2'],
        required: true
    },
    availableGames: [{
        gameType: {
            type: String,
            enum: ['memory', 'scrabble', 'anagrams', 'quiz', 'taboo', 'jumbled_letters'],
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        maxScore: {
            type: Number,
            default: 100
        },
        timeLimit: {
            type: Number, // in minutes
            default: 10
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Ensure unique combination of scenario and level
gameDeploymentSchema.index({ scenario: 1, level: 1 }, { unique: true });

export const GameDeployment = mongoose.model('GameDeployment', gameDeploymentSchema);