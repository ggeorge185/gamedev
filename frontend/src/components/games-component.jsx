import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { GamepadIcon, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import GameList from './game-list.jsx';
import GameForm from './game-form';

const GamesComponent = () => {
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGameType, setEditingGameType] = useState(null);

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

  const handleSave = async (formData, gameTypeId = null) => {
    try {
      if (gameTypeId) {
        // Update existing game type
        const res = await axios.put(`/api/v1/game/admin/game-types/${gameTypeId}`, formData, {
          withCredentials: true
        });
        
        if (res.data.success) {
          toast.success(res.data.message);
          await loadGameTypes();
          handleCancel();
        }
      } else {
        // Create new game type
        const res = await axios.post('/api/v1/game/admin/game-types', formData, {
          withCredentials: true
        });
        
        if (res.data.success) {
          toast.success(res.data.message);
          await loadGameTypes();
          handleCancel();
        }
      }
    } catch (error) {
      console.error('Error saving game type:', error);
      toast.error(error.response?.data?.message || 'Failed to save game type');
      throw error;
    }
  };

  const handleEdit = (gameType) => {
    setEditingGameType(gameType);
    setShowAddForm(true);
  };

  const handleDelete = (gameType) => {
    // TODO: Implement delete functionality
    toast.info(`Delete functionality for ${gameType.name} would be implemented here`);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingGameType(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GamepadIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Game Management</h1>
            <p className="text-gray-600 text-sm">Manage game types and their configurations</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadGameTypes}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Game Type
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6">
          <GameForm
            gameType={editingGameType}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Game Types List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <GameList
          gameTypes={gameTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default GamesComponent;