import mongoose from "mongoose";
import { Scenario } from "../models/scenario.model.js";
import { Game } from "../models/game.model.js";
import { Word } from "../models/word.model.js";
import { GameResult } from "../models/gameResult.model.js";
import { User } from "../models/user.model.js";

// Helper function to shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Helper function to generate anagram from word
const generateAnagram = (word) => {
    return shuffleArray(word.split('')).join('');
};

// Helper function to create wrong answers for multiple choice
const generateWrongAnswers = (correctAnswer, allWords, count = 3) => {
    const wrongAnswers = allWords
        .filter(word => word.englishTranslation.toLowerCase() !== correctAnswer.toLowerCase())
        .map(word => word.englishTranslation)
        .slice(0, count);
    
    // If not enough wrong answers, generate some generic ones
    while (wrongAnswers.length < count) {
        wrongAnswers.push(`Option ${wrongAnswers.length + 1}`);
    }
    
    return wrongAnswers.slice(0, count);
};

export const startGame = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const playerId = req.id;

        // Fetch scenario with populated game
        const scenario = await Scenario.findById(scenarioId)
            .populate('selectedGameId')
            .populate('author', 'username profilePicture');

        if (!scenario) {
            return res.status(404).json({
                message: 'Scenario not found',
                success: false
            });
        }

        if (!scenario.isActive) {
            return res.status(400).json({
                message: 'This scenario is currently inactive',
                success: false
            });
        }

        const game = scenario.selectedGameId;
        if (!game || !game.isActive) {
            return res.status(400).json({
                message: 'Associated game is not available',
                success: false
            });
        }

        // Fetch vocabulary words matching topic and language level
        const vocabularyWords = await Word.find({
            topic: scenario.topic,
            languageLevel: scenario.languageLevel
        }).populate('author', 'username');

        if (vocabularyWords.length < game.minWords) {
            return res.status(400).json({
                message: `Insufficient vocabulary words. Need at least ${game.minWords} words, found ${vocabularyWords.length}`,
                success: false
            });
        }

        // Select random words up to maxWords limit
        const selectedWords = shuffleArray(vocabularyWords).slice(0, game.maxWords);

        // Get formatted game data
        const gameData = await getFormattedGameData(game, selectedWords);

        // Prepare response
        const gameSession = {
            sessionId: `${scenarioId}_${Date.now()}`,
            scenario: {
                _id: scenario._id,
                name: scenario.name,
                story: scenario.story,
                topic: scenario.topic,
                languageLevel: scenario.languageLevel,
                difficulty: scenario.difficulty,
                estimatedDuration: scenario.estimatedDuration,
                sequence: scenario.sequence,
                author: scenario.author
            },
            game: {
                _id: game._id,
                name: game.name,
                displayName: game.displayName,
                description: game.description,
                gameType: game.gameType,
                difficulty: game.difficulty,
                timeLimit: game.timeLimit,
                minWords: game.minWords,
                maxWords: game.maxWords,
                instructions: game.instructions
            },
            gameData,
            totalWords: selectedWords.length,
            startTime: new Date().toISOString(),
            player: playerId
        };

        return res.status(200).json({
            message: 'Game session started successfully',
            gameSession,
            success: true
        });

    } catch (error) {
        console.error('Error starting game:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

// Helper function to format game data based on game type
const getFormattedGameData = async (game, words) => {
    switch (game.gameType) {
        case 'word-puzzle':
            return {
                type: 'anagram',
                puzzles: words.map(word => ({
                    id: word._id,
                    anagram: generateAnagram(word.germanWordSingular),
                    hint: word.englishTranslation,
                    correctAnswer: word.germanWordSingular,
                    article: word.article
                }))
            };

        case 'quiz':
            return {
                type: 'multiple-choice',
                questions: words.map(word => {
                    const wrongAnswers = generateWrongAnswers(word.englishTranslation, words);
                    const allOptions = shuffleArray([word.englishTranslation, ...wrongAnswers]);
                    
                    return {
                        id: word._id,
                        question: `What does "${word.article} ${word.germanWordSingular}" mean in English?`,
                        germanWord: word.germanWordSingular,
                        article: word.article,
                        options: allOptions,
                        correctAnswer: word.englishTranslation,
                        hint: word.englishDescription || word.englishTranslation
                    };
                })
            };

        case 'matching':
            const germanWords = words.map(word => ({
                id: word._id,
                text: `${word.article} ${word.germanWordSingular}`,
                type: 'german'
            }));
            
            const englishWords = words.map(word => ({
                id: word._id,
                text: word.englishTranslation,
                type: 'english'
            }));

            return {
                type: 'matching-pairs',
                germanWords: shuffleArray(germanWords),
                englishWords: shuffleArray(englishWords),
                totalPairs: words.length
            };

        case 'memory':
            const memoryCards = [];
            words.forEach(word => {
                memoryCards.push({
                    id: `${word._id}_german`,
                    content: `${word.article} ${word.germanWordSingular}`,
                    type: 'german',
                    matchId: word._id
                });
                memoryCards.push({
                    id: `${word._id}_english`,
                    content: word.englishTranslation,
                    type: 'english',
                    matchId: word._id
                });
            });

            return {
                type: 'memory-cards',
                cards: shuffleArray(memoryCards),
                totalPairs: words.length
            };

        case 'typing':
            return {
                type: 'typing-exercise',
                exercises: words.map(word => ({
                    id: word._id,
                    prompt: `Type the German word for: ${word.englishTranslation}`,
                    correctAnswer: word.germanWordSingular,
                    article: word.article,
                    hint: word.englishDescription || `Article: ${word.article}`
                }))
            };

        case 'drag-drop':
            return {
                type: 'drag-and-drop',
                items: words.map(word => ({
                    id: word._id,
                    draggable: word.germanWordSingular,
                    dropZone: word.englishTranslation,
                    article: word.article
                })),
                draggableItems: shuffleArray(words.map(word => ({
                    id: word._id,
                    content: `${word.article} ${word.germanWordSingular}`
                }))),
                dropZones: words.map(word => ({
                    id: word._id,
                    label: word.englishTranslation,
                    acceptsId: word._id
                }))
            };

        default:
            return {
                type: 'basic',
                words: words.map(word => ({
                    id: word._id,
                    germanWord: word.germanWordSingular,
                    germanPlural: word.germanWordPlural,
                    article: word.article,
                    englishTranslation: word.englishTranslation,
                    englishDescription: word.englishDescription
                }))
            };
    }
};

export const getGameData = async (req, res) => {
    try {
        const { gameId, topic, languageLevel, wordCount = 10 } = req.query;

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: 'Game not found',
                success: false
            });
        }

        const words = await Word.find({
            topic: topic,
            languageLevel: languageLevel
        }).limit(parseInt(wordCount));

        const gameData = await getFormattedGameData(game, words);

        return res.status(200).json({
            gameData,
            game: {
                _id: game._id,
                name: game.name,
                displayName: game.displayName,
                gameType: game.gameType,
                instructions: game.instructions
            },
            success: true
        });

    } catch (error) {
        console.error('Error getting game data:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const submitGameResult = async (req, res) => {
    try {
        const {
            scenarioId,
            gameId,
            score,
            totalQuestions,
            correctAnswers,
            completionTime,
            detailedResults,
            startTime
        } = req.body;

        const playerId = req.id;

        // Validate required fields
        if (!scenarioId || !gameId || score === undefined || !totalQuestions || correctAnswers === undefined) {
            return res.status(400).json({
                message: 'Missing required fields',
                success: false
            });
        }

        // Fetch scenario and game for additional data
        const [scenario, game] = await Promise.all([
            Scenario.findById(scenarioId),
            Game.findById(gameId)
        ]);

        if (!scenario || !game) {
            return res.status(404).json({
                message: 'Scenario or game not found',
                success: false
            });
        }

        // Calculate completion time if not provided
        const calculatedCompletionTime = completionTime || 
            (startTime ? Math.floor((new Date() - new Date(startTime)) / 1000) : 0);

        // Create game result
        const gameResult = await GameResult.create({
            player: playerId,
            scenario: scenarioId,
            game: gameId,
            score: Math.max(0, Math.min(100, score)), // Ensure score is between 0-100
            totalQuestions,
            correctAnswers: Math.min(correctAnswers, totalQuestions), // Ensure correct answers <= total
            completionTime: calculatedCompletionTime,
            difficulty: scenario.difficulty,
            languageLevel: scenario.languageLevel,
            topic: scenario.topic,
            gameType: game.gameType,
            detailedResults: detailedResults || {},
            completedAt: new Date()
        });

        // Populate the result with related data
        const populatedResult = await GameResult.findById(gameResult._id)
            .populate('player', 'username profilePicture')
            .populate('scenario', 'name topic languageLevel')
            .populate('game', 'displayName gameType');

        return res.status(201).json({
            message: 'Game result submitted successfully',
            result: populatedResult,
            success: true
        });

    } catch (error) {
        console.error('Error submitting game result:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const getPlayerResults = async (req, res) => {
    try {
        const playerId = req.id;
        const { limit = 10, skip = 0, scenarioId, gameType } = req.query;

        let filter = { player: playerId };
        
        if (scenarioId) filter.scenario = scenarioId;
        if (gameType) filter.gameType = gameType;

        const results = await GameResult.find(filter)
            .populate('scenario', 'name topic languageLevel difficulty')
            .populate('game', 'displayName gameType')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const totalResults = await GameResult.countDocuments(filter);

        // Calculate player statistics
        const stats = await GameResult.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$score' },
                    totalGamesPlayed: { $sum: 1 },
                    averageCompletionTime: { $avg: '$completionTime' },
                    bestScore: { $max: '$score' },
                    totalCorrectAnswers: { $sum: '$correctAnswers' },
                    totalQuestions: { $sum: '$totalQuestions' }
                }
            }
        ]);

        return res.status(200).json({
            results,
            pagination: {
                total: totalResults,
                limit: parseInt(limit),
                skip: parseInt(skip),
                hasMore: skip + results.length < totalResults
            },
            statistics: stats[0] || {
                averageScore: 0,
                totalGamesPlayed: 0,
                averageCompletionTime: 0,
                bestScore: 0,
                totalCorrectAnswers: 0,
                totalQuestions: 0
            },
            success: true
        });

    } catch (error) {
        console.error('Error getting player results:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

export const getScenarioLeaderboard = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const { limit = 10 } = req.query;

        const leaderboard = await GameResult.aggregate([
            { $match: { scenario: new mongoose.Types.ObjectId(scenarioId) } },
            {
                $group: {
                    _id: '$player',
                    bestScore: { $max: '$score' },
                    averageScore: { $avg: '$score' },
                    totalGames: { $sum: 1 },
                    bestTime: { $min: '$completionTime' },
                    lastPlayed: { $max: '$createdAt' }
                }
            },
            { $sort: { bestScore: -1, bestTime: 1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'player'
                }
            },
            { $unwind: '$player' },
            {
                $project: {
                    _id: 0,
                    player: {
                        _id: '$player._id',
                        username: '$player.username',
                        profilePicture: '$player.profilePicture'
                    },
                    bestScore: 1,
                    averageScore: 1,
                    totalGames: 1,
                    bestTime: 1,
                    lastPlayed: 1
                }
            }
        ]);

        return res.status(200).json({
            leaderboard,
            scenarioId,
            success: true
        });

    } catch (error) {
        console.error('Error getting scenario leaderboard:', error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};