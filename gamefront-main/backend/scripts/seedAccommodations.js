import mongoose from "mongoose";
import MiniGame from "../models/miniGame.model.js";
import dotenv from "dotenv";

dotenv.config();

const seedAccommodations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await MiniGame.deleteMany({});
        console.log('Cleared existing accommodation data');

        // Sample accommodation data
        const accommodations = [
            {
                title: "Cozy Studio in Berlin Mitte",
                location: "Berlin Mitte, Germany",
                price: "850€/month",
                deposit: "1700€",
                description: "Beautiful studio apartment in the heart of Berlin. Fully furnished with modern amenities. Close to public transport and universities.",
                isScam: false,
                redFlags: [],
                greenFlags: [
                    "Reasonable deposit (2x rent)",
                    "Central location",
                    "Professional description",
                    "Detailed information provided"
                ]
            },
            {
                title: "AMAZING LUXURY APARTMENT SUPER CHEAP!!!",
                location: "Munich Center",
                price: "400€/month",
                deposit: "200€",
                description: "Luxury penthouse apartment for super cheap! Amazing deal! Contact me NOW before someone else takes it!! Send money transfer immediately to secure!!!",
                isScam: true,
                redFlags: [
                    "Price too good to be true for location",
                    "Multiple exclamation marks",
                    "Pressure to act immediately",
                    "Requests money transfer upfront",
                    "Unprofessional writing style"
                ],
                greenFlags: []
            },
            {
                title: "Shared Apartment Room",
                location: "Hamburg, St. Pauli",
                price: "600€/month",
                deposit: "1200€",
                description: "Nice room in shared apartment with 3 other students. Kitchen and bathroom shared. Rent includes utilities and internet. Available from next month.",
                isScam: false,
                redFlags: [],
                greenFlags: [
                    "Transparent about shared facilities",
                    "Reasonable pricing for location",
                    "Includes utilities information",
                    "Clear availability date"
                ]
            },
            {
                title: "Exclusive Villa Room",
                location: "Frankfurt",
                price: "300€/month",
                deposit: "100€",
                description: "Room in exclusive villa. Must pay first 6 months upfront. Only serious applicants. No viewing available, trust me it's amazing!",
                isScam: true,
                redFlags: [
                    "Extremely low price for exclusive property",
                    "Demands large upfront payment",
                    "No viewing allowed",
                    "Vague contact information"
                ],
                greenFlags: []
            },
            {
                title: "Modern 1-Bedroom Apartment",
                location: "Cologne, Innenstadt",
                price: "950€/month",
                deposit: "1900€",
                description: "Modern 1-bedroom apartment near city center. Recently renovated with new kitchen and bathroom. Viewing available weekdays 2-6 PM.",
                isScam: false,
                redFlags: [],
                greenFlags: [
                    "Standard deposit amount",
                    "Professional photos",
                    "Viewing times specified",
                    "Detailed property description"
                ]
            },
            {
                title: "Student Housing URGENT",
                location: "Bremen",
                price: "250€/month",
                deposit: "50€",
                description: "URGENT! Need to rent quickly due to emergency! Beautiful student room. Send passport copy and 500€ deposit via Western Union to hold room!",
                isScam: true,
                redFlags: [
                    "Fake urgency",
                    "Requests passport copy upfront",
                    "Western Union payment method",
                    "Suspicious payment amount vs. listed deposit"
                ],
                greenFlags: []
            },
            {
                title: "Furnished Room in WG",
                location: "Dresden, Neustadt",
                price: "420€/month",
                deposit: "840€",
                description: "Furnished room in friendly WG with 2 other students. Room has bed, desk, wardrobe. Shared kitchen and living room. Close to TU Dresden.",
                isScam: false,
                redFlags: [],
                greenFlags: [
                    "Appropriate price for city",
                    "Clear description of furnishing",
                    "Mentions specific university proximity",
                    "Normal WG setup described"
                ]
            },
            {
                title: "Luxury Penthouse - No Questions Asked",
                location: "Düsseldorf",
                price: "500€/month", 
                deposit: "250€",
                description: "Luxury penthouse. No questions asked, no documents needed. Cash only. Contact my assistant John Smith for immediate move-in.",
                isScam: true,
                redFlags: [
                    "No documentation required",
                    "Cash only payments",
                    "Suspicious middleman contact",
                    "Generic English name for German property"
                ],
                greenFlags: []
            }
        ];

        const result = await MiniGame.insertMany(accommodations);
        console.log(`Inserted ${result.length} accommodation records`);

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding accommodations:', error);
        mongoose.connection.close();
    }
};

// Run the seeding function
seedAccommodations();