import React from 'react';
import { GamepadIcon } from 'lucide-react';
import GameCard from './game-card';

const GameList = ({ gameTypes, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading game types...</p>
      </div>
    );
  }

  if (gameTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <GamepadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Game Types Found</h3>
        <p className="text-gray-600">No game types have been configured yet.</p>
        <p className="text-gray-500 text-sm mt-1">Add a new game type to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Game Types</h2>
        <div className="text-sm text-gray-600">
          {gameTypes.length} game type{gameTypes.length !== 1 ? 's' : ''} configured
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameTypes.map((gameType) => (
          <GameCard
            key={gameType._id}
            gameType={gameType}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total</div>
            <div className="font-semibold text-gray-900">{gameTypes.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Active</div>
            <div className="font-semibold text-green-600">
              {gameTypes.filter(gt => gt.isActive).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Inactive</div>
            <div className="font-semibold text-gray-600">
              {gameTypes.filter(gt => !gt.isActive).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">With Config</div>
            <div className="font-semibold text-blue-600">
              {gameTypes.filter(gt => gt.configOptions && Object.keys(gt.configOptions).length > 0).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameList;