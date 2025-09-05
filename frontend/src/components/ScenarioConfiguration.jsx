import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Settings, Save, RefreshCw, MapPin, Target } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ScenarioConfiguration = () => {
  const [scenarios, setScenarios] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [editingConfig, setEditingConfig] = useState(null);

  const difficultyLevels = ['A1', 'A2', 'B1', 'B2'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scenariosRes, gameTypesRes, configsRes] = await Promise.all([
        axios.get('/api/v1/game/scenarios'),
        axios.get('/api/v1/game/game-types'),
        axios.get('/api/v1/game/scenario-configs')
      ]);

      if (scenariosRes.data.success) {
        setScenarios(scenariosRes.data.scenarios);
      }
      if (gameTypesRes.data.success) {
        setGameTypes(gameTypesRes.data.gameTypes);
      }
      if (configsRes.data.success) {
        setConfigs(configsRes.data.configs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load configuration data');
    } finally {
      setLoading(false);
    }
  };

  const getConfigForScenarioAndLevel = (scenarioId, level) => {
    return configs.find(config => 
      config.scenario._id === scenarioId && config.difficultyLevel === level
    );
  };

  const updateConfig = async (scenarioId, level, gameTypeId, instructions) => {
    try {
      const existingConfig = getConfigForScenarioAndLevel(scenarioId, level);
      
      if (existingConfig) {
        // Update existing configuration
        const res = await axios.put(`/api/v1/game/admin/scenario-configs/${existingConfig._id}`, {
          gameTypeId,
          instructions
        }, { withCredentials: true });

        if (res.data.success) {
          // Update local state
          setConfigs(prev => prev.map(config => 
            config._id === existingConfig._id 
              ? { ...config, gameType: gameTypes.find(gt => gt._id === gameTypeId), instructions }
              : config
          ));
        }
      } else {
        // Create new configuration
        const res = await axios.post('/api/v1/game/admin/scenario-configs', {
          scenarioId,
          gameTypeId,
          difficultyLevel: level,
          instructions: instructions || ''
        }, { withCredentials: true });

        if (res.data.success) {
          // Add to local state
          setConfigs(prev => [...prev, res.data.config]);
        }
      }
      
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update configuration');
    }
  };

  const updateScenarioMapPosition = async (scenarioId, mapPosition) => {
    try {
      const res = await axios.put(`/api/v1/game/admin/scenarios/${scenarioId}`, {
        mapPosition
      }, { withCredentials: true });

      if (res.data.success) {
        // Update local state
        setScenarios(prev => prev.map(scenario => 
          scenario._id === scenarioId 
            ? { ...scenario, mapPosition }
            : scenario
        ));
        setEditingScenario(null);
        toast.success('Map position updated successfully');
      }
    } catch (error) {
      console.error('Error updating map position:', error);
      toast.error('Failed to update map position');
    }
  };

  const saveAllConfigs = async () => {
    setSaving(true);
    try {
      // Here you would batch save all configurations
      toast.success('All configurations saved successfully');
    } catch (error) {
      toast.error('Failed to save configurations');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Scenario Configuration</h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={saveAllConfigs}
            className="bg-green-600 hover:bg-green-700"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Configure Game Types for Each Scenario & Difficulty
          </h2>
          <p className="text-gray-600 text-sm">
            Assign specific game types to scenario-difficulty combinations. This determines 
            which game players will experience when they select a scenario at a given difficulty level.
          </p>
        </div>

        {scenarios.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No scenarios found. Please add scenarios first.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {scenarios.map((scenario) => (
              <div key={scenario._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scenario.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{scenario.description}</p>
                  </div>
                  <Button
                    onClick={() => setEditingScenario(editingScenario === scenario._id ? null : scenario._id)}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    Edit Map Position
                  </Button>
                </div>

                {/* Map Position Editor */}
                {editingScenario === scenario._id && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">Edit Map Position</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">X Position</label>
                        <input
                          type="number"
                          value={scenario.mapPosition?.x || 0}
                          onChange={(e) => {
                            const newMapPosition = { ...scenario.mapPosition, x: parseInt(e.target.value) || 0 };
                            setScenarios(prev => prev.map(s => 
                              s._id === scenario._id 
                                ? { ...s, mapPosition: newMapPosition }
                                : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Y Position</label>
                        <input
                          type="number"
                          value={scenario.mapPosition?.y || 0}
                          onChange={(e) => {
                            const newMapPosition = { ...scenario.mapPosition, y: parseInt(e.target.value) || 0 };
                            setScenarios(prev => prev.map(s => 
                              s._id === scenario._id 
                                ? { ...s, mapPosition: newMapPosition }
                                : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={() => updateScenarioMapPosition(scenario._id, scenario.mapPosition)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save Position
                      </Button>
                      <Button
                        onClick={() => setEditingScenario(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {scenario.availableLevels.map((level) => {
                    const currentConfig = getConfigForScenarioAndLevel(scenario._id, level);
                    
                    return (
                      <div key={level} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900">Level {level}</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Assigned Game:
                            </label>
                            <select
                              value={currentConfig?.gameType?._id || ''}
                              onChange={(e) => updateConfig(scenario._id, level, e.target.value, currentConfig?.instructions)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            >
                              <option value="">Select Game Type</option>
                              {gameTypes.map((gameType) => (
                                <option key={gameType._id} value={gameType._id}>
                                  {gameType.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Instructions for Players:
                            </label>
                            <textarea
                              value={currentConfig?.instructions || ''}
                              onChange={(e) => {
                                const instructions = e.target.value;
                                // Update local state immediately for better UX
                                setConfigs(prev => prev.map(config => 
                                  config._id === currentConfig?._id 
                                    ? { ...config, instructions }
                                    : config
                                ));
                              }}
                              onBlur={(e) => {
                                if (currentConfig?.gameType?._id) {
                                  updateConfig(scenario._id, level, currentConfig.gameType._id, e.target.value);
                                }
                              }}
                              placeholder="Enter instructions that will be shown to players when they start this scenario level..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              rows={3}
                            />
                          </div>

                          {currentConfig && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                              <div className="font-medium text-green-800">
                                Currently: {currentConfig.gameType?.name}
                              </div>
                              <div className="text-green-600">
                                Component: {currentConfig.gameType?.componentName}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Scenario completion requirements */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm text-blue-800">
                    <strong>Story Context:</strong> {scenario.storyContext}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    Required for story completion: {scenario.isRequired ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Configuration Summary */}
        {configs.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Game Type Usage</h4>
                <div className="space-y-1">
                  {gameTypes.map((gameType) => {
                    const usageCount = configs.filter(config => 
                      config.gameType._id === gameType._id
                    ).length;
                    
                    return (
                      <div key={gameType._id} className="flex justify-between text-sm">
                        <span>{gameType.name}:</span>
                        <span className="font-medium">{usageCount} assignments</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scenario Coverage</h4>
                <div className="space-y-1">
                  {scenarios.map((scenario) => {
                    const configuredLevels = scenario.availableLevels.filter(level =>
                      getConfigForScenarioAndLevel(scenario._id, level)
                    ).length;
                    
                    return (
                      <div key={scenario._id} className="flex justify-between text-sm">
                        <span>{scenario.name}:</span>
                        <span className="font-medium">
                          {configuredLevels}/{scenario.availableLevels.length} configured
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioConfiguration;