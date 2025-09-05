import mongoose from "mongoose";

const scenarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Scenario name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Scenario name cannot exceed 100 characters']
    },
    story: {
        type: String,
        required: [true, 'Scenario story is required'],
        trim: true,
        maxlength: [2000, 'Story cannot exceed 2000 characters']
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true,
        maxlength: [50, 'Topic cannot exceed 50 characters']
    },
    selectedGameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, 'Selected game is required'],
        validate: {
            validator: async function(gameId) {
                // Check if the game exists and is active
                const Game = mongoose.model('Game');
                const game = await Game.findById(gameId);
                return game && game.isActive;
            },
            message: 'Selected game must exist and be active'
        }
    },
    languageLevel: {
        type: String,
        enum: {
            values: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
            message: 'Language level must be one of: A1, A2, B1, B2, C1, C2'
        },
        default: 'A1'
    },
    sequence: {
        type: Number,
        required: [true, 'Sequence number is required'],
        unique: true,
        min: [1, 'Sequence must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Sequence must be an integer'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    estimatedDuration: {
        type: Number,
        default: 10,
        min: [1, 'Estimated duration must be at least 1 minute'],
        max: [120, 'Estimated duration cannot exceed 2 hours']
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

// Indexes for efficient querying
scenarioSchema.index({ sequence: 1 }); // For ordering scenarios
scenarioSchema.index({ topic: 1 }); // For topic-based queries
scenarioSchema.index({ languageLevel: 1 }); // For level-based queries
scenarioSchema.index({ isActive: 1 }); // For active scenario queries
scenarioSchema.index({ selectedGameId: 1 }); // For game-based queries
scenarioSchema.index({ author: 1 }); // For user scenarios

// Compound index for topic and level queries
scenarioSchema.index({ topic: 1, languageLevel: 1 });

// Virtual for formatted duration
scenarioSchema.virtual('formattedDuration').get(function() {
    if (this.estimatedDuration >= 60) {
        const hours = Math.floor(this.estimatedDuration / 60);
        const minutes = this.estimatedDuration % 60;
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${this.estimatedDuration}m`;
});

// Pre-save middleware to handle sequence uniqueness and ordering
scenarioSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('sequence')) {
        try {
            // Check if sequence already exists
            const existingScenario = await this.constructor.findOne({
                sequence: this.sequence,
                _id: { $ne: this._id }
            });

            if (existingScenario) {
                // If sequence exists, shift all scenarios with sequence >= this.sequence
                await this.constructor.updateMany(
                    { 
                        sequence: { $gte: this.sequence },
                        _id: { $ne: this._id }
                    },
                    { $inc: { sequence: 1 } }
                );
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Pre-remove middleware to adjust sequences when deleting
scenarioSchema.pre('deleteOne', { document: true }, async function(next) {
    try {
        // Shift down all scenarios with sequence > this.sequence
        await this.constructor.updateMany(
            { sequence: { $gt: this.sequence } },
            { $inc: { sequence: -1 } }
        );
    } catch (error) {
        return next(error);
    }
    next();
});

// Static method to get next available sequence
scenarioSchema.statics.getNextSequence = async function() {
    const lastScenario = await this.findOne({}).sort({ sequence: -1 });
    return lastScenario ? lastScenario.sequence + 1 : 1;
};

// Static method to reorder scenarios
scenarioSchema.statics.reorderScenarios = async function(reorderData) {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            // reorderData should be array of { id, newSequence }
            const updates = reorderData.map(({ id, newSequence }) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { sequence: newSequence }
                }
            }));

            await this.bulkWrite(updates, { session });
        });
    } finally {
        await session.endSession();
    }
};

// Instance method to move to specific sequence
scenarioSchema.methods.moveToSequence = async function(newSequence) {
    const oldSequence = this.sequence;
    
    if (oldSequence === newSequence) {
        return this;
    }

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            if (newSequence > oldSequence) {
                // Moving down: shift up all scenarios between old and new position
                await this.constructor.updateMany(
                    { 
                        sequence: { $gt: oldSequence, $lte: newSequence },
                        _id: { $ne: this._id }
                    },
                    { $inc: { sequence: -1 } },
                    { session }
                );
            } else {
                // Moving up: shift down all scenarios between new and old position
                await this.constructor.updateMany(
                    { 
                        sequence: { $gte: newSequence, $lt: oldSequence },
                        _id: { $ne: this._id }
                    },
                    { $inc: { sequence: 1 } },
                    { session }
                );
            }

            // Update this scenario's sequence
            this.sequence = newSequence;
            await this.save({ session });
        });
    } finally {
        await session.endSession();
    }

    return this;
};

// Ensure virtual fields are serialized
scenarioSchema.set('toJSON', { virtuals: true });
scenarioSchema.set('toObject', { virtuals: true });

export const Scenario = mongoose.model('Scenario', scenarioSchema);