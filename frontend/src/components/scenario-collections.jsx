import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Target, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ScenarioCollectionList from './scenario-collection-list.jsx';
import ScenarioCollectionForm from './scenario-collection-form.jsx';

const ScenarioCollections = () => {
  const [collections, setCollections] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [collectionsRes, scenariosRes, gameTypesRes] = await Promise.all([
        axios.get('/api/v1/game/scenario-configs'),
        axios.get('/api/v1/game/scenarios'),
        axios.get('/api/v1/game/game-types')
      ]);

      if (collectionsRes.data.success) {
        setCollections(collectionsRes.data.configs);
      }
      if (scenariosRes.data.success) {
        setScenarios(scenariosRes.data.scenarios);
      }
      if (gameTypesRes.data.success) {
        setGameTypes(gameTypesRes.data.gameTypes);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, collectionId = null) => {
    try {
      if (collectionId) {
        // Update existing configuration
        const res = await axios.put(`/api/v1/game/admin/scenario-configs/${collectionId}`, {
          gameTypeId: formData.gameTypeId,
          instructions: formData.instructions,
          isActive: formData.isActive
        }, { withCredentials: true });

        if (res.data.success) {
          toast.success('Configuration updated successfully');
          await loadData();
          handleCancel();
        }
      } else {
        // Create new configuration
        const res = await axios.post('/api/v1/game/admin/scenario-configs', {
          scenarioId: formData.scenarioId,
          gameTypeId: formData.gameTypeId,
          difficultyLevel: formData.difficultyLevel,
          instructions: formData.instructions,
          isActive: formData.isActive
        }, { withCredentials: true });

        if (res.data.success) {
          toast.success('Configuration created successfully');
          await loadData();
          handleCancel();
        }
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('duplicate')) {
        toast.error('A configuration for this scenario and difficulty level already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save configuration');
      }
      throw error;
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setShowAddForm(true);
  };

  const handleConfigure = (collection) => {
    // Open detailed configuration for this specific collection
    toast.info(`Opening detailed configuration for ${collection.scenario?.name} - ${collection.difficultyLevel}`);
    // This could open a modal or navigate to a detailed configuration page
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCollection(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scenario-Game Collections</h1>
            <p className="text-gray-600 text-sm">Manage game assignments for scenario difficulty levels</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Configuration
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6">
          <ScenarioCollectionForm
            collection={editingCollection}
            scenarios={scenarios}
            gameTypes={gameTypes}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Collections List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ScenarioCollectionList
          collections={collections}
          onEdit={handleEdit}
          onConfigure={handleConfigure}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      {!loading && collections.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                const unconfiguredScenarios = scenarios.filter(scenario => 
                  !scenario.availableLevels?.every(level =>
                    collections.some(config => 
                      config.scenario._id === scenario._id && config.difficultyLevel === level
                    )
                  )
                );
                
                if (unconfiguredScenarios.length > 0) {
                  toast.info(`${unconfiguredScenarios.length} scenario(s) need more configurations`);
                } else {
                  toast.success('All scenarios are fully configured!');
                }
              }}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Check Coverage
            </Button>
            
            <Button
              onClick={() => {
                const inactiveConfigs = collections.filter(c => !c.isActive);
                toast.info(`${inactiveConfigs.length} configuration(s) are inactive`);
              }}
              variant="outline"
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              Check Inactive
            </Button>
            
            <Button
              onClick={() => {
                const unassignedConfigs = collections.filter(c => !c.gameType);
                if (unassignedConfigs.length > 0) {
                  toast.warning(`${unassignedConfigs.length} configuration(s) have no game assigned`);
                } else {
                  toast.success('All configurations have games assigned!');
                }
              }}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Check Assignments
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioCollections;