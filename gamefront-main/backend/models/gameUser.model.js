import mongoose from "mongoose";

const gameUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    currentLevel: { 
        type: String, 
        enum: ['A1', 'A2', 'B1', 'B2'], 
        default: 'A1' 
    },
    completedScenarios: [{
        scenario: {
            type: String,
            enum: ['accommodation', 'city_registration', 'university', 'banking', 'everyday_items']
        },
        level: {
            type: String,
            enum: ['A1', 'A2', 'B1', 'B2']
        },
        completedGames: [{
            gameType: {
                type: String,
                enum: ['jumbled_letters', 'taboo', 'quiz', 'memory_game']
            },
            score: { type: Number, default: 0 },
            completedAt: { type: Date, default: Date.now }
        }],
        completedAt: { type: Date, default: Date.now }
    }],
    totalScore: { type: Number, default: 0 },
    achievements: [{ type: String }],
    storyModeProgress: {
        currentScenario: {
            type: String,
            enum: ['accommodation', 'city_registration', 'university', 'banking', 'everyday_items'],
            default: 'accommodation'
        },
        unlockedScenarios: [{
            type: String,
            enum: ['accommodation', 'city_registration', 'university', 'banking', 'everyday_items']
        }]
    }
}, { timestamps: true });

// Initialize with accommodation unlocked by default
gameUserSchema.pre('save', function(next) {
    if (this.isNew && this.storyModeProgress.unlockedScenarios.length === 0) {
        this.storyModeProgress.unlockedScenarios.push('accommodation');
    }
    next();
});

export const GameUser = mongoose.model('GameUser', gameUserSchema);