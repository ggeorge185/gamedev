import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    germanWordSingular: { 
        type: String, 
        required: true,
        trim: true
    },
    germanWordPlural: { 
        type: String, 
        default: '',
        trim: true
    },
    article: { 
        type: String, 
        required: true,
        enum: ['der', 'die', 'das'],
        trim: true
    },
    topic: { 
        type: String, 
        required: true,
        trim: true
    },
    image: { 
        type: String, 
        default: '' 
    },
    languageLevel: { 
        type: String, 
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        default: 'A1'
    },
    englishTranslation: { 
        type: String, 
        default: '',
        trim: true
    },
    englishDescription: { 
        type: String, 
        default: '',
        trim: true
    },
    jeopardyQuestion: { 
        type: String, 
        default: '',
        trim: true
    },
    clues: [{ 
        type: String,
        trim: true
    }],
    synonyms: [{ 
        type: String,
        trim: true
    }],
    furtherCharacteristics: [{ 
        type: String,
        trim: true
    }],
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, {
    timestamps: true
});

// Index for efficient searching
wordSchema.index({ germanWordSingular: 1 });
wordSchema.index({ topic: 1 });
wordSchema.index({ languageLevel: 1 });
wordSchema.index({ author: 1 });

export const Word = mongoose.model('Word', wordSchema);