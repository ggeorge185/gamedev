import mongoose from "mongoose";
import dotenv from "dotenv";
import { Scenario } from "./models/scenario.model.js";
import { GameType } from "./models/gameType.model.js";
import { ScenarioConfig } from "./models/scenarioConfig.model.js";
import connectDB from "./utils/db.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        await Scenario.deleteMany({});
        await GameType.deleteMany({});
        await ScenarioConfig.deleteMany({});
        
        // Create scenarios
        const scenarios = await Scenario.insertMany([
            {
                name: 'Finding Accommodation',
                description: 'Find suitable housing in Germany',
                order: 1,
                mapPosition: { x: 20, y: 30 },
                storyContext: 'Alex just arrived in Germany and needs to find a place to live. Help Alex navigate through housing options and rental processes.',
                availableLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                isRequired: true
            },
            {
                name: 'City Registration',
                description: 'Register with local authorities',
                order: 2,
                mapPosition: { x: 50, y: 20 },
                storyContext: 'Alex needs to register with the local authorities (Anmeldung) - a crucial step for living in Germany.',
                availableLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                isRequired: true
            },
            {
                name: 'University Related',
                description: 'Enroll in university and navigate academic life',
                order: 3,
                mapPosition: { x: 80, y: 40 },
                storyContext: 'Alex wants to study in Germany and needs to understand the university system, enrollment processes, and academic vocabulary.',
                availableLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                isRequired: true
            },
            {
                name: 'Banking',
                description: 'Open a bank account and manage finances',
                order: 4,
                mapPosition: { x: 30, y: 70 },
                storyContext: 'Alex needs to open a German bank account and learn about financial services and banking vocabulary.',
                availableLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                isRequired: true
            },
            {
                name: 'Medical Related',
                description: 'Get health insurance and understand medical system',
                order: 5,
                mapPosition: { x: 70, y: 80 },
                storyContext: 'Alex needs to get health insurance and learn about the German medical system and healthcare vocabulary.',
                availableLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                isRequired: true
            }
        ]);
        
        // Create game types
        const gameTypes = await GameType.insertMany([
            {
                name: 'Taboo',
                description: 'Guess the word without using forbidden terms',
                componentName: 'TabooGame',
                configOptions: {
                    timeLimit: 60,
                    forbiddenWordsCount: 5
                },
                isActive: true
            },
            {
                name: 'Memory Game',
                description: 'Match pairs of cards to test memory',
                componentName: 'MemoryGame',
                configOptions: {
                    gridSize: '4x4',
                    timeLimit: 120
                },
                isActive: true
            },
            {
                name: 'Scrabble',
                description: 'Form words using letter tiles',
                componentName: 'ScrabbleGame',
                configOptions: {
                    boardSize: '15x15',
                    timeLimit: 300
                },
                isActive: true
            },
            {
                name: 'Quiz',
                description: 'Answer multiple choice questions',
                componentName: 'QuizGame',
                configOptions: {
                    questionsCount: 10,
                    timePerQuestion: 30
                },
                isActive: true
            },
            {
                name: 'Anagram',
                description: 'Unscramble German words',
                componentName: 'AnagramGame',
                configOptions: {
                    wordsCount: 10,
                    timeLimit: 180
                },
                isActive: true
            }
        ]);
        
        // Create default scenario configurations
        const configs = [];
        for (const scenario of scenarios) {
            for (const level of scenario.availableLevels) {
                // Assign random game type for now (admin can change later)
                const randomGameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
                configs.push({
                    scenario: scenario._id,
                    gameType: randomGameType._id,
                    difficultyLevel: level,
                    gameConfig: {},
                    isActive: true
                });
            }
        }
        
        await ScenarioConfig.insertMany(configs);
        
        console.log('Database seeded successfully!');
        console.log(`Created ${scenarios.length} scenarios`);
        console.log(`Created ${gameTypes.length} game types`);
        console.log(`Created ${configs.length} scenario configurations`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedData();
}

export default seedData;