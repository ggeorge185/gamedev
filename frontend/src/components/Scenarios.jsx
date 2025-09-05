import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ScenarioList from './ScenarioList';
import DraggableScenarioList from './DraggableScenarioList';
import ScenarioForm from './ScenarioForm';
import { Button } from './ui/button';
import { Plus, BookOpen } from 'lucide-react';

const Scenarios = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingScenario, setEditingScenario] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        setEditingScenario(null);
        setActiveTab('user');
    };

    const handleCreateClick = () => {
        setShowCreateForm(true);
        setEditingScenario(null);
    };

    const handleEditScenario = (scenario) => {
        setEditingScenario(scenario);
        setShowCreateForm(true);
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setEditingScenario(null);
    };

    if (showCreateForm) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <ScenarioForm 
                    scenario={editingScenario}
                    onClose={handleCloseForm}
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
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        Scenarios
                    </h1>
                    <p className="text-gray-600 mt-2">Create and manage learning scenarios that combine topics with interactive games</p>
                </div>
                <Button onClick={handleCreateClick} className="shrink-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Scenario
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="active">Available Scenarios</TabsTrigger>
                    <TabsTrigger value="all">All Scenarios</TabsTrigger>
                    <TabsTrigger value="user">My Scenarios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                    <ScenarioList type="active" />
                </TabsContent>
                
                <TabsContent value="all">
                    <ScenarioList type="all" />
                </TabsContent>
                
                <TabsContent value="user">
                    <DraggableScenarioList 
                        showAddButton={true} 
                        onAddClick={handleCreateClick}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Scenarios;