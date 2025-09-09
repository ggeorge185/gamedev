import React, { useState } from 'react';
import Games from './Games';
import Scenarios from './Scenarios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const DemoPage = () => {
    const [activeTab, setActiveTab] = useState('games');

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Enhanced Game Management Demo
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        This demonstrates the enhanced scenario and game management components ported from the backend branch. 
                        These components provide improved user interfaces with tabs, search, filtering, and comprehensive forms.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="games">Enhanced Game Management</TabsTrigger>
                        <TabsTrigger value="scenarios">Enhanced Scenario Management</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="games">
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                            <h2 className="text-2xl font-semibold mb-3">Games Component Features:</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                                <li>Tab-based interface (Available Games, All Games, My Games)</li>
                                <li>Comprehensive game creation form with configuration options</li>
                                <li>Game cards with edit/delete actions</li>
                                <li>Search and filtering capabilities</li>
                                <li>Support for Memory, Quiz, Anagram, Scrabble, and Taboo games</li>
                            </ul>
                        </div>
                        <Games />
                    </TabsContent>
                    
                    <TabsContent value="scenarios">
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                            <h2 className="text-2xl font-semibold mb-3">Scenarios Component Features:</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                                <li>Tab-based interface (Available Scenarios, All Scenarios, My Scenarios)</li>
                                <li>Rich scenario creation form with story context, levels, and map positioning</li>
                                <li>Scenario cards showing available levels and context</li>
                                <li>Search and filtering by language level</li>
                                <li>Support for A1-C2 language levels</li>
                            </ul>
                        </div>
                        <Scenarios />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DemoPage;