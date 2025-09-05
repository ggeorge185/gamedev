import React from 'react';
import { Button } from './ui/button';
import { Edit, Target, Settings } from 'lucide-react';

const ScenarioCollectionCard = ({ collection, onEdit, onConfigure }) => {
  const { scenario, gameType, difficultyLevel, instructions, isActive } = collection;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{scenario?.name}</h3>
            <p className="text-sm text-gray-600">Level {difficultyLevel}</p>
          </div>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Assigned Game */}
      <div className="mb-3 p-2 bg-blue-50 rounded">
        <div className="text-xs font-medium text-blue-800 mb-1">Assigned Game:</div>
        <div className="text-sm font-semibold text-blue-900">
          {gameType?.name || 'Not Assigned'}
        </div>
        {gameType?.componentName && (
          <div className="text-xs text-blue-700 font-mono">
            {gameType.componentName}
          </div>
        )}
      </div>

      {/* Instructions */}
      {instructions && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="text-xs font-medium text-gray-700 mb-1">Player Instructions:</div>
          <div className="text-xs text-gray-600 line-clamp-2">
            {instructions}
          </div>
        </div>
      )}

      {/* Game Configuration Preview */}
      {gameType?.configOptions && Object.keys(gameType.configOptions).length > 0 && (
        <div className="mb-3 p-2 bg-yellow-50 rounded text-xs">
          <div className="font-medium text-yellow-800 mb-1">Game Config:</div>
          {Object.entries(gameType.configOptions).slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex justify-between text-yellow-700">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span>{value}</span>
            </div>
          ))}
          {Object.keys(gameType.configOptions).length > 2 && (
            <div className="text-yellow-600 mt-1">
              +{Object.keys(gameType.configOptions).length - 2} more options
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onEdit(collection)}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          onClick={() => onConfigure(collection)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Settings className="w-4 h-4 mr-1" />
          Configure
        </Button>
      </div>

      {/* Status Summary */}
      <div className="mt-2 text-xs text-center">
        <span className="text-gray-600">
          {scenario?.name} • {difficultyLevel} • {gameType?.name || 'No Game'}
        </span>
      </div>
    </div>
  );
};

export default ScenarioCollectionCard;