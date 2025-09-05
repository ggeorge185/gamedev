import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Save, X, MapPin } from 'lucide-react';

const ScenarioForm = ({ scenario = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: scenario?.name || '',
    description: scenario?.description || '',
    order: scenario?.order || '',
    mapPosition: {
      x: scenario?.mapPosition?.x || 0,
      y: scenario?.mapPosition?.y || 0
    },
    storyContext: scenario?.storyContext || '',
    availableLevels: scenario?.availableLevels || ['A1', 'A2', 'B1', 'B2'],
    isRequired: scenario?.isRequired !== undefined ? scenario.isRequired : true
  });

  const scenarioNameOptions = [
    'Accommodation',
    'City Registration', 
    'University',
    'Banking',
    'Everyday Items',
    'Medical Insurance'
  ];

  const levelOptions = ['A1', 'A2', 'B1', 'B2'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('mapPosition.')) {
      const positionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mapPosition: {
          ...prev.mapPosition,
          [positionKey]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || '' : value)
      }));
    }
  };

  const handleLevelChange = (level, isChecked) => {
    setFormData(prev => ({
      ...prev,
      availableLevels: isChecked 
        ? [...prev.availableLevels, level].sort()
        : prev.availableLevels.filter(l => l !== level)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.availableLevels.length === 0) {
      alert('Please select at least one difficulty level');
      return;
    }
    
    try {
      await onSave(formData, scenario?._id);
    } catch (error) {
      console.error('Error saving scenario:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {scenario ? 'Edit Scenario' : 'Add New Scenario'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a scenario</option>
              {scenarioNameOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <Input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              placeholder="1"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the scenario..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Story Context
          </label>
          <textarea
            name="storyContext"
            value={formData.storyContext}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide context for this scenario in the story..."
            required
          />
        </div>

        {/* Map Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Map Position
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">X Position (0-100)</label>
              <Input
                type="number"
                name="mapPosition.x"
                value={formData.mapPosition.x}
                onChange={handleInputChange}
                min="0"
                max="100"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Y Position (0-100)</label>
              <Input
                type="number"
                name="mapPosition.y"
                value={formData.mapPosition.y}
                onChange={handleInputChange}
                min="0"
                max="100"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Available Levels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Difficulty Levels
          </label>
          <div className="grid grid-cols-4 gap-2">
            {levelOptions.map(level => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.availableLevels.includes(level)}
                  onChange={(e) => handleLevelChange(level, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isRequired"
            checked={formData.isRequired}
            onChange={handleInputChange}
            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Required for story completion
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {scenario ? 'Update' : 'Create'}
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

export default ScenarioForm;