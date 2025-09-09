import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GamepadIcon, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const GameTypeManagement = () => {
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    componentName: '',
    configOptions: '',
    isActive: true
  });

  const gameTypeOptions = ['Taboo', 'Memory Game', 'Scrabble', 'Quiz', 'Anagram'];

  useEffect(() => {
    loadGameTypes();
  }, []);

  const loadGameTypes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/game/game-types');
      if (res.data.success) {
        setGameTypes(res.data.gameTypes);
      }
    } catch (error) {
      console.error('Error loading game types:', error);
      toast.error('Failed to load game types');
    } finally {
      setLoading(false);
    }
  };

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

      if (editingId) {
        // Update existing game type (would need PUT endpoint)
        toast.info('Update functionality would be implemented here');
      } else {
        // Create new game type
        const res = await axios.post('/api/v1/game/admin/game-types', payload, {
          withCredentials: true
        });
        
        if (res.data.success) {
          toast.success(res.data.message);
          loadGameTypes();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving game type:', error);
      toast.error(error.response?.data?.message || 'Failed to save game type');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      componentName: '',
      configOptions: '',
      isActive: true
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const startEdit = (gameType) => {
    setFormData({
      name: gameType.name,
      description: gameType.description,
      componentName: gameType.componentName,
      configOptions: JSON.stringify(gameType.configOptions, null, 2),
      isActive: gameType.isActive
    });
    setEditingId(gameType._id);
    setShowAddForm(true);
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
          <GamepadIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Game Type Management</h1>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Game Type
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Game Type' : 'Add New Game Type'}
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
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Game Types List */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Game Types</h2>
          
          {gameTypes.length === 0 ? (
            <div className="text-center py-8">
              <GamepadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No game types configured yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Component</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Config</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gameTypes.map((gameType) => (
                    <tr key={gameType._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{gameType.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                        {gameType.componentName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                        {gameType.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          gameType.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {gameType.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {Object.keys(gameType.configOptions || {}).length} options
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => startEdit(gameType)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              toast.info('Delete functionality would be implemented here');
                            }}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTypeManagement;