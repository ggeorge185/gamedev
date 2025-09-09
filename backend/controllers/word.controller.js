import { Word } from "../models/word.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";

// Multer setup for bulk upload (JSON)
const upload = multer({ dest: 'tmp/' });

// BULK IMPORT FUNCTION (JSON)
export const bulkUploadJSON = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const authorId = req.id;
    try {
      // Read uploaded JSON file
      const fs = await import('fs/promises');
      const fileContent = await fs.readFile(req.file.path, 'utf8');
      let words = JSON.parse(fileContent);

      if (!Array.isArray(words)) {
        words = [words];
      }

      const wordsToInsert = words.map(row => ({
        ...row,
        clues: Array.isArray(row.clues) ? row.clues : [],
        synonyms: Array.isArray(row.synonyms) ? row.synonyms : [],
        furtherCharacteristics: Array.isArray(row.furtherCharacteristics) ? row.furtherCharacteristics : [],
        author: authorId,
      }));

      const inserted = await Word.insertMany(wordsToInsert);
      await fs.unlink(req.file.path);

      res.json({ success: true, count: inserted.length });
    } catch (err) {
      try {
        const fs = await import('fs/promises');
        await fs.unlink(req.file.path);
      } catch (_) {}
      res.status(400).json({ success: false, message: err.message });
    }
  }
];

// BULK IMPORT FUNCTION (CSV)
export const bulkUploadCSV = async (req, res) => {
  try {
    const { words } = req.body;
    const authorId = req.id;

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid words data provided" 
      });
    }

    // Validate and prepare words for insertion
    const wordsToInsert = [];
    const validationErrors = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const rowNum = i + 1;

      // Validate required fields
      if (!word.germanWordSingular?.trim()) {
        validationErrors.push(`Row ${rowNum}: Missing German word singular`);
        continue;
      }
      if (!word.article?.trim()) {
        validationErrors.push(`Row ${rowNum}: Missing article`);
        continue;
      }
      if (!word.topic?.trim()) {
        validationErrors.push(`Row ${rowNum}: Missing topic`);
        continue;
      }

      // Prepare word object
      const wordToInsert = {
        germanWordSingular: word.germanWordSingular.trim(),
        germanWordPlural: word.germanWordPlural?.trim() || '',
        article: word.article.trim(),
        topic: word.topic.trim(),
        languageLevel: word.languageLevel || 'A1',
        englishTranslation: word.englishTranslation?.trim() || '',
        englishDescription: word.englishDescription?.trim() || '',
        jeopardyQuestion: word.jeopardyQuestion?.trim() || '',
        clues: Array.isArray(word.clues) ? word.clues : [],
        synonyms: Array.isArray(word.synonyms) ? word.synonyms : [],
        furtherCharacteristics: Array.isArray(word.furtherCharacteristics) ? word.furtherCharacteristics : [],
        author: authorId
      };

      wordsToInsert.push(wordToInsert);
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors found",
        errors: validationErrors
      });
    }

    // Insert words into database
    const inserted = await Word.insertMany(wordsToInsert);

    res.json({ 
      success: true, 
      count: inserted.length,
      message: `Successfully uploaded ${inserted.length} words from CSV`
    });

  } catch (error) {
    console.error('CSV bulk upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error during CSV upload'
    });
  }
};

// ================== Existing Functions ==================

export const addWord = async (req, res) => {
    try {
        const {
            germanWordSingular,
            germanWordPlural,
            article,
            topic,
            languageLevel,
            englishTranslation,
            englishDescription,
            jeopardyQuestion,
            clues,
            synonyms,
            furtherCharacteristics
        } = req.body;

        const authorId = req.id;

        if (!germanWordSingular || !article || !topic) {
            return res.status(400).json({
                message: 'German word singular, article, and topic are required',
                success: false
            });
        }

        // Check if word already exists for this user
        const existingWord = await Word.findOne({
            germanWordSingular: germanWordSingular.toLowerCase(),
            author: authorId
        });

        if (existingWord) {
            return res.status(400).json({
                message: 'This word already exists in your collection',
                success: false
            });
        }

        let imageUrl = '';
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            imageUrl = cloudResponse.secure_url;
        }

        // Parse arrays from string if needed
        const parseArray = (arr) => {
            if (typeof arr === 'string') {
                try {
                    return JSON.parse(arr);
                } catch {
                    return arr.split(',').map(item => item.trim()).filter(item => item);
                }
            }
            return Array.isArray(arr) ? arr : [];
        };

        const word = await Word.create({
            germanWordSingular: germanWordSingular.trim(),
            germanWordPlural: germanWordPlural?.trim() || '',
            article,
            topic: topic.trim(),
            image: imageUrl,
            languageLevel: languageLevel || 'A1',
            englishTranslation: englishTranslation?.trim() || '',
            englishDescription: englishDescription?.trim() || '',
            jeopardyQuestion: jeopardyQuestion?.trim() || '',
            clues: parseArray(clues),
            synonyms: parseArray(synonyms),
            furtherCharacteristics: parseArray(furtherCharacteristics),
            author: authorId
        });

        const user = await User.findById(authorId).select('-password');
        const populatedWord = await Word.findById(word._id).populate({
            path: 'author',
            select: '-password'
        });

        return res.status(201).json({
            message: 'Word added successfully',
            word: populatedWord,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const getAllWords = async (req, res) => {
    try {
        const words = await Word.find()
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            words,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const getUserWords = async (req, res) => {
    try {
        const authorId = req.id;
        const words = await Word.find({ author: authorId })
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            words,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const deleteWord = async (req, res) => {
    try {
        const wordId = req.params.id;
        const authorId = req.id;

        const word = await Word.findById(wordId);
        if (!word) {
            return res.status(404).json({
                message: 'Word not found',
                success: false
            });
        }

        // Check if user owns this word
        //if (word.author.toString() !== authorId) {
        //    return res.status(403).json({
        //        message: 'Unauthorized to delete this word',
        //        success: false
        //    });
        //}

        await Word.findByIdAndDelete(wordId);

        return res.status(200).json({
            message: 'Word deleted successfully',
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const updateWord = async (req, res) => {
    try {
        const wordId = req.params.id;
        const authorId = req.id;
        const {
            germanWordSingular,
            germanWordPlural,
            article,
            topic,
            languageLevel,
            englishTranslation,
            englishDescription,
            jeopardyQuestion,
            clues,
            synonyms,
            furtherCharacteristics
        } = req.body;

        const word = await Word.findById(wordId);
        if (!word) {
            return res.status(404).json({
                message: 'Word not found',
                success: false
            });
        }

        // Check if user owns this word
        //if (word.author.toString() !== authorId) {
        //    return res.status(403).json({
        //        message: 'Unauthorized to update this word',
        //        success: false
        //    });
        //}

        // Parse arrays from string if needed
        const parseArray = (arr) => {
            if (typeof arr === 'string') {
                try {
                    return JSON.parse(arr);
                } catch {
                    return arr.split(',').map(item => item.trim()).filter(item => item);
                }
            }
            return Array.isArray(arr) ? arr : [];
        };

        let imageUrl = word.image;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            imageUrl = cloudResponse.secure_url;
        }

        const updatedWord = await Word.findByIdAndUpdate(wordId, {
            germanWordSingular: germanWordSingular?.trim() || word.germanWordSingular,
            germanWordPlural: germanWordPlural?.trim() || word.germanWordPlural,
            article: article || word.article,
            topic: topic?.trim() || word.topic,
            image: imageUrl,
            languageLevel: languageLevel || word.languageLevel,
            englishTranslation: englishTranslation?.trim() || word.englishTranslation,
            englishDescription: englishDescription?.trim() || word.englishDescription,
            jeopardyQuestion: jeopardyQuestion?.trim() || word.jeopardyQuestion,
            clues: clues ? parseArray(clues) : word.clues,
            synonyms: synonyms ? parseArray(synonyms) : word.synonyms,
            furtherCharacteristics: furtherCharacteristics ? parseArray(furtherCharacteristics) : word.furtherCharacteristics
        }, { new: true }).populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: 'Word updated successfully',
            word: updatedWord,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const searchWords = async (req, res) => {
    try {
        const { query, level, topic } = req.query;
        let searchFilter = {};

        if (query) {
            searchFilter.$or = [
                { germanWordSingular: { $regex: query, $options: 'i' } },
                { germanWordPlural: { $regex: query, $options: 'i' } },
                { englishTranslation: { $regex: query, $options: 'i' } },
                { topic: { $regex: query, $options: 'i' } }
            ];
        }

        if (level) {
            searchFilter.languageLevel = level;
        }

        if (topic) {
            searchFilter.topic = { $regex: topic, $options: 'i' };
        }

        const words = await Word.find(searchFilter)
            .populate({ path: 'author', select: '-password' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            words,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const getTopics = async (req, res) => {
    try {
        const topics = await Word.distinct('topic');
        
        // Filter out empty topics and sort alphabetically
        const filteredTopics = topics
            .filter(topic => topic && topic.trim())
            .sort();

        return res.status(200).json({
            topics: filteredTopics,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};
