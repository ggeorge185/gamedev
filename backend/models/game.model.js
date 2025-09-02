import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Game name is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9-_]+$/, 'Game name can only contain lowercase letters, numbers, hyphens, and underscores']
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
        trim: true,
        maxlength: [100, 'Display name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Game description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    minWords: {
        type: Number,
        default: 5,
        min: [1, 'Minimum words must be at least 1'],
        max: [50, 'Minimum words cannot exceed 50'],
        validate: {
            validator: function(value) {
                return value <= this.maxWords;
            },
            message: 'Minimum words must be less than or equal to maximum words'
        }
    },
    maxWords: {
        type: Number,
        default: 10,
        min: [1, 'Maximum words must be at least 1'],
        max: [100, 'Maximum words cannot exceed 100'],
        validate: {
            validator: function(value) {
                return value >= this.minWords;
            },
            message: 'Maximum words must be greater than or equal to minimum words'
        }
    },
    timeLimit: {
        type: Number,
        default: 300,
        min: [30, 'Time limit must be at least 30 seconds'],
        max: [1800, 'Time limit cannot exceed 30 minutes']
    },
    instructions: {
        type: String,
        required: [true, 'Game instructions are required'],
        trim: true,
        maxlength: [1000, 'Instructions cannot exceed 1000 characters']
    },
    gameType: {
        type: String,
        required: [true, 'Game type is required'],
        enum: {
            values: ['word-puzzle', 'matching', 'quiz', 'memory', 'drag-drop', 'typing', 'pronunciation'],
            message: 'Game type must be one of: word-puzzle, matching, quiz, memory, drag-drop, typing, pronunciation'
        },
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for efficient searching and querying
gameSchema.index({ name: 1 });
gameSchema.index({ gameType: 1 });
gameSchema.index({ isActive: 1 });
gameSchema.index({ author: 1 });
gameSchema.index({ difficulty: 1 });

// Virtual for formatted time limit
gameSchema.virtual('formattedTimeLimit').get(function() {
    const minutes = Math.floor(this.timeLimit / 60);
    const seconds = this.timeLimit % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
});

// Ensure virtual fields are serialized
gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

export const Game = mongoose.model('Game', gameSchema);