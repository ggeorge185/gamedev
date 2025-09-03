import mongoose from "mongoose";

const scenarioCollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500
    },
    languageLevel: {
        type: String,
        required: true,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        index: true
    },
    scenarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scenario',
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isDefault: {
        type: Boolean,
        default: false,
        index: true
    },
    targetAudience: {
        type: String,
        enum: ['general', 'beginners', 'students', 'professionals', 'children'],
        default: 'general'
    },
    estimatedCompletionTime: {
        type: Number, // in minutes
        min: 5,
        max: 300
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        default: 1
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound indexes for efficient querying
scenarioCollectionSchema.index({ languageLevel: 1, isActive: 1 });
scenarioCollectionSchema.index({ languageLevel: 1, isDefault: 1 });
scenarioCollectionSchema.index({ author: 1, createdAt: -1 });
scenarioCollectionSchema.index({ tags: 1, languageLevel: 1 });

// Virtual for scenario count
scenarioCollectionSchema.virtual('scenarioCount').get(function() {
    return this.scenarios ? this.scenarios.length : 0;
});

// Virtual for formatted completion time
scenarioCollectionSchema.virtual('formattedCompletionTime').get(function() {
    if (!this.estimatedCompletionTime) return 'Not specified';
    
    const hours = Math.floor(this.estimatedCompletionTime / 60);
    const minutes = this.estimatedCompletionTime % 60;
    
    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
});

// Pre-save middleware to update lastUpdated
scenarioCollectionSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.lastUpdated = new Date();
        this.version += 1;
    }
    next();
});

// Pre-save middleware to ensure only one default per language level
scenarioCollectionSchema.pre('save', async function(next) {
    if (this.isDefault && this.isModified('isDefault')) {
        // Remove default flag from other collections of the same language level
        await this.constructor.updateMany(
            { 
                languageLevel: this.languageLevel, 
                _id: { $ne: this._id },
                isDefault: true 
            },
            { isDefault: false }
        );
    }
    next();
});

// Method to calculate total estimated time from scenarios
scenarioCollectionSchema.methods.calculateTotalTime = async function() {
    await this.populate('scenarios');
    const totalMinutes = this.scenarios.reduce((total, scenario) => {
        return total + (scenario.estimatedDuration || 0);
    }, 0);
    
    this.estimatedCompletionTime = totalMinutes;
    return totalMinutes;
};

// Static method to get collections by language level
scenarioCollectionSchema.statics.getByLanguageLevel = function(level, activeOnly = true) {
    const query = { languageLevel: level };
    if (activeOnly) query.isActive = true;
    
    return this.find(query)
        .populate('scenarios')
        .populate('author', 'username profilePicture')
        .sort({ isDefault: -1, createdAt: -1 });
};

// Static method to get default collection for a language level
scenarioCollectionSchema.statics.getDefault = function(level) {
    return this.findOne({ 
        languageLevel: level, 
        isDefault: true, 
        isActive: true 
    })
    .populate('scenarios')
    .populate('author', 'username profilePicture');
};

export const ScenarioCollection = mongoose.model('ScenarioCollection', scenarioCollectionSchema);