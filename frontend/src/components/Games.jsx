import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import GameList from './GameList';
import GameForm from './GameForm';
import { Button } from './ui/button';
import { Plus, GamepadIcon } from 'lucide-react';

const Games = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeTab, setActiveTab] = useState('active');

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        // Optionally switch to user games tab to see the new game
        setActiveTab('user');
    };

    if (showCreateForm) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <GameForm 
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={handleCreateSuccess}
                />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <GamepadIcon className="w-8 h-8 text-blue-600" />
                        Games
                    </h1>
                    <p className="text-gray-600 mt-2">Discover and play language learning games</p>
                </div>
                <Button onClick={() => setShowCreateForm(true)} className="shrink-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Game
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="active">Available Games</TabsTrigger>
                    <TabsTrigger value="all">All Games</TabsTrigger>
                    <TabsTrigger value="user">My Games</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                    <GameList type="active" />
                </TabsContent>
                
                <TabsContent value="all">
                    <GameList type="all" />
                </TabsContent>
                
                <TabsContent value="user">
                    <GameList type="user" showAddButton={true} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Games;