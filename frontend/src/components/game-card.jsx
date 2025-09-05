import React from 'react';
import { Button } from './ui/button';
import { Edit, Trash2, GamepadIcon } from 'lucide-react';

const GameCard = ({ gameType, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <GamepadIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{gameType.name}</h3>
            <p className="text-sm text-gray-600 font-mono">{gameType.componentName}</p>
          </div>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          gameType.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {gameType.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {gameType.description}
      </p>

      {gameType.configOptions && Object.keys(gameType.configOptions).length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
          <div className="font-medium text-gray-700 mb-1">Configuration:</div>
          {Object.entries(gameType.configOptions).slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex justify-between text-gray-600">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span>{value}</span>
            </div>
          ))}
          {Object.keys(gameType.configOptions).length > 2 && (
            <div className="text-gray-500 mt-1">
              +{Object.keys(gameType.configOptions).length - 2} more options
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onEdit(gameType)}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(gameType)}
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default GameCard;