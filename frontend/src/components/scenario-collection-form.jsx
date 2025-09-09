import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ScenarioCollectionForm = ({ collection = null, scenarios = [], gameTypes = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    scenarioId: collection?.scenario?._id || '',
    gameTypeId: collection?.gameType?._id || '',
    difficultyLevel: collection?.difficultyLevel || 'A1',
    instructions: collection?.instructions || '',
    isActive: collection?.isActive !== undefined ? collection.isActive : true
  });

  const difficultyLevels = ['A1', 'A2', 'B1', 'B2'];

  // Filter available levels based on selected scenario
  const [availableLevels, setAvailableLevels] = useState(difficultyLevels);

  useEffect(() => {
    if (formData.scenarioId) {
      const selectedScenario = scenarios.find(s => s._id === formData.scenarioId);
      if (selectedScenario?.availableLevels) {
        setAvailableLevels(selectedScenario.availableLevels);
        // Reset difficulty level if current selection is not available for this scenario
        if (!selectedScenario.availableLevels.includes(formData.difficultyLevel)) {
          setFormData(prev => ({
            ...prev,
            difficultyLevel: selectedScenario.availableLevels[0]
          }));
        }
      }
    }
  }, [formData.scenarioId, scenarios, formData.difficultyLevel]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await onSave(formData, collection?._id);
    } catch (error) {
      console.error('Error saving scenario configuration:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {collection ? 'Edit Scenario Configuration' : 'Add New Scenario Configuration'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scenario
            </label>
            <select
              name="scenarioId"
              value={formData.scenarioId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a scenario</option>
              {scenarios.map((scenario) => (
                <option key={scenario._id} value={scenario._id}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {availableLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {availableLevels.length < difficultyLevels.length && (
              <p className="text-xs text-gray-500 mt-1">
                Only showing levels available for selected scenario
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Game Type
          </label>
          <select
            name="gameTypeId"
            value={formData.gameTypeId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select a game type</option>
            {gameTypes.filter(gt => gt.isActive).map((gameType) => (
              <option key={gameType._id} value={gameType._id}>
                {gameType.name} ({gameType.componentName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions for Players
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter instructions that will be shown to players when they start this scenario level..."
          />
          <p className="text-xs text-gray-500 mt-1">
            These instructions will be displayed to players before they start the game.
          </p>
        </div>

        {/* Preview of selected game type */}
        {formData.gameTypeId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            {(() => {
              const selectedGameType = gameTypes.find(gt => gt._id === formData.gameTypeId);
              return selectedGameType ? (
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Selected Game Preview:</h4>
                  <div className="text-sm text-blue-800">
                    <div><strong>Name:</strong> {selectedGameType.name}</div>
                    <div><strong>Description:</strong> {selectedGameType.description}</div>
                    <div><strong>Component:</strong> {selectedGameType.componentName}</div>
                    {selectedGameType.configOptions && Object.keys(selectedGameType.configOptions).length > 0 && (
                      <div className="mt-2">
                        <strong>Configuration:</strong>
                        <div className="ml-2 mt-1 text-xs">
                          {Object.entries(selectedGameType.configOptions).map(([key, value]) => (
                            <div key={key}>• {key}: {value}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Active (available for players)
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {collection ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScenarioCollectionForm;