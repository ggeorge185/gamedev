import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ScenarioCollectionList from './ScenarioCollectionList';
import ScenarioCollectionForm from './ScenarioCollectionForm';
import { Button } from './ui/button';
import { Plus, Library } from 'lucide-react';

const ScenarioCollections = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [activeTab, setActiveTab] = useState('user');

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        setEditingCollection(null);
        setActiveTab('user');
    };

    const handleCreateClick = () => {
        setShowCreateForm(true);
        setEditingCollection(null);
    };

    const handleEditCollection = (collection) => {
        setEditingCollection(collection);
        setShowCreateForm(true);
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setEditingCollection(null);
    };

    if (showCreateForm) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <ScenarioCollectionForm 
                    collection={editingCollection}
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
                        <Library className="w-8 h-8 text-blue-600" />
                        Scenario Collections
                    </h1>
                    <p className="text-gray-600 mt-2">Create and manage curated lists of scenarios for different language levels</p>
                </div>
                <Button onClick={handleCreateClick} className="shrink-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="user">My Collections</TabsTrigger>
                    <TabsTrigger value="all">All Collections</TabsTrigger>
                </TabsList>
                
                <TabsContent value="user">
                    <ScenarioCollectionList 
                        type="user" 
                        showAddButton={true} 
                        onAddClick={handleCreateClick}
                        onEditCollection={handleEditCollection}
                    />
                </TabsContent>
                
                <TabsContent value="all">
                    <ScenarioCollectionList 
                        type="all"
                        onEditCollection={handleEditCollection}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ScenarioCollections;