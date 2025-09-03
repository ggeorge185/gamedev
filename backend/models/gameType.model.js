import mongoose from "mongoose";

const gameTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['Taboo', 'Memory Game', 'Scrabble', 'Quiz']
    },
    description: {
        type: String,
        required: true
    },
    // Technical details for developers
    componentName: {
        type: String,
        required: true, // e.g., 'TabooGame', 'MemoryGame', etc.
    },
    // Game configuration options (can be extended per game type)
    configOptions: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Whether this game type is active and available
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient searching
gameTypeSchema.index({ name: 1 });
gameTypeSchema.index({ isActive: 1 });

export const GameType = mongoose.model('GameType', gameTypeSchema);