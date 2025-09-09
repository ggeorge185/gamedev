import mongoose from "mongoose";

const gameResultSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scenario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scenario',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 1
    },
    correctAnswers: {
        type: Number,
        required: true,
        min: 0
    },
    completionTime: {
        type: Number, // in seconds
        required: true,
        min: 0
    },
    languageLevel: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        required: true
    },
    levelIndex: {
        type: Number,
        default: 0,
        min: 0
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    gameType: {
        type: String,
        enum: ['word-puzzle', 'matching', 'quiz', 'memory', 'drag-drop', 'typing', 'pronunciation'],
        required: true
    },
    detailedResults: {
        type: mongoose.Schema.Types.Mixed, // Store game-specific results
        default: {}
    },
    isCompleted: {
        type: Boolean,
        default: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
gameResultSchema.index({ player: 1, createdAt: -1 });
gameResultSchema.index({ scenario: 1, createdAt: -1 });
gameResultSchema.index({ game: 1, createdAt: -1 });
gameResultSchema.index({ topic: 1, languageLevel: 1 });
gameResultSchema.index({ gameType: 1, languageLevel: 1 });
gameResultSchema.index({ scenario: 1, levelIndex: 1 });

// Virtual for accuracy percentage
gameResultSchema.virtual('accuracy').get(function() {
    return this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
});

// Virtual for performance rating
gameResultSchema.virtual('performanceRating').get(function() {
    const accuracy = this.accuracy;
    if (accuracy >= 90) return 'Excellent';
    if (accuracy >= 80) return 'Good';
    if (accuracy >= 70) return 'Average';
    if (accuracy >= 60) return 'Below Average';
    return 'Needs Improvement';
});

export const GameResult = mongoose.model('GameResult', gameResultSchema);