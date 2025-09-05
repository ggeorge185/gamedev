import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { MapPin, Plus, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ScenarioList from './scenario-list';
import ScenarioForm from './scenario-form';

const ScenariosComponent = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/game/scenarios');
      if (res.data.success) {
        setScenarios(res.data.scenarios);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      toast.error('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, scenarioId = null) => {
    try {
      if (scenarioId) {
        // Update existing scenario
        const res = await axios.put(`/api/v1/game/admin/scenarios/${scenarioId}`, formData, {
          withCredentials: true
        });
        
        if (res.data.success) {
          toast.success('Scenario updated successfully');
          await loadScenarios();
          handleCancel();
        }
      } else {
        // Create new scenario - would need POST endpoint
        toast.info('Create scenario functionality would be implemented here');
        // For now, just show the data would be sent
        console.log('Scenario data to create:', formData);
      }
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast.error(error.response?.data?.message || 'Failed to save scenario');
      throw error;
    }
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setShowAddForm(true);
  };

  const handleConfigure = (scenario) => {
    // Navigate to scenario configuration for this specific scenario
    toast.info(`Opening game configuration for ${scenario.name}`);
    // In a real app, this might navigate to a specific configuration page
    // or open a modal with scenario-specific configuration
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingScenario(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scenario Management</h1>
            <p className="text-gray-600 text-sm">Manage game scenarios and their properties</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadScenarios}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              toast.info('Global scenario configuration');
              // This could navigate to the ScenarioConfiguration component
            }}
            variant="outline"
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Games
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Scenario
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6">
          <ScenarioForm
            scenario={editingScenario}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Scenarios List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ScenarioList
          scenarios={scenarios}
          onEdit={handleEdit}
          onConfigure={handleConfigure}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ScenariosComponent;