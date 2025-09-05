import React from 'react';
import { Button } from './ui/button';
import { Edit, MapPin, Target, CheckCircle, XCircle } from 'lucide-react';

const ScenarioCard = ({ scenario, onEdit, onConfigure }) => {
  const getStatusColor = (isRequired) => {
    return isRequired ? 'text-green-600' : 'text-gray-600';
  };

  const getStatusIcon = (isRequired) => {
    return isRequired ? CheckCircle : XCircle;
  };

  const StatusIcon = getStatusIcon(scenario.isRequired);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
            <p className="text-sm text-gray-600">Order: {scenario.order}</p>
          </div>
        </div>
        <StatusIcon className={`w-5 h-5 ${getStatusColor(scenario.isRequired)}`} />
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {scenario.description}
      </p>

      {/* Map Position */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">Map Position:</div>
        <div className="flex justify-between text-gray-600">
          <span>X: {scenario.mapPosition?.x || 0}</span>
          <span>Y: {scenario.mapPosition?.y || 0}</span>
        </div>
      </div>

      {/* Available Levels */}
      <div className="mb-3">
        <div className="text-xs font-medium text-gray-700 mb-1">Available Levels:</div>
        <div className="flex gap-1 flex-wrap">
          {scenario.availableLevels?.map((level) => (
            <span 
              key={level}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <Target className="w-3 h-3 mr-1" />
              {level}
            </span>
          ))}
        </div>
      </div>

      {/* Story Context Preview */}
      {scenario.storyContext && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
          <div className="font-medium text-blue-800 mb-1">Story Context:</div>
          <div className="text-blue-700 line-clamp-2">
            {scenario.storyContext}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onEdit(scenario)}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          onClick={() => onConfigure(scenario)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Target className="w-4 h-4 mr-1" />
          Configure
        </Button>
      </div>

      {/* Required Status */}
      <div className="mt-2 text-xs text-center">
        <span className={`font-medium ${getStatusColor(scenario.isRequired)}`}>
          {scenario.isRequired ? 'Required for Story Completion' : 'Optional Scenario'}
        </span>
      </div>
    </div>
  );
};

export default ScenarioCard;