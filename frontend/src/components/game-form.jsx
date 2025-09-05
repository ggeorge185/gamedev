import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

const GameForm = ({ gameType = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: gameType?.name || '',
    description: gameType?.description || '',
    componentName: gameType?.componentName || '',
    configOptions: gameType?.configOptions ? JSON.stringify(gameType.configOptions, null, 2) : '',
    isActive: gameType?.isActive !== undefined ? gameType.isActive : true
  });

  const gameTypeOptions = ['Taboo', 'Memory Game', 'Scrabble', 'Quiz', 'Anagram'];

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
      const payload = {
        ...formData,
        configOptions: formData.configOptions ? JSON.parse(formData.configOptions) : {}
      };
      
      await onSave(payload, gameType?._id);
    } catch (error) {
      if (formData.configOptions) {
        toast.error('Invalid JSON in configuration options');
      } else {
        toast.error('Failed to save game type');
      }
    }
  };

  const generateComponentName = (gameName) => {
    if (!gameName) return '';
    return gameName.replace(/\s+/g, '') + 'Game';
  };

  // Auto-generate component name when game name changes
  React.useEffect(() => {
    if (formData.name && !gameType) { // Only auto-generate for new game types
      setFormData(prev => ({
        ...prev,
        componentName: generateComponentName(formData.name)
      }));
    }
  }, [formData.name, gameType]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {gameType ? 'Edit Game Type' : 'Add New Game Type'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game Type Name
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a game type</option>
              {gameTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Name
            </label>
            <Input
              type="text"
              name="componentName"
              value={formData.componentName}
              onChange={handleInputChange}
              placeholder="e.g., TabooGame"
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
            placeholder="Describe the game..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Configuration Options (JSON)
          </label>
          <textarea
            name="configOptions"
            value={formData.configOptions}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder='{"timeLimit": 60, "questionsCount": 10}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter game-specific configuration as valid JSON (optional)
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Active (available for use)
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {gameType ? 'Update' : 'Create'}
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

export default GameForm;