import React from 'react';
import { MapPin } from 'lucide-react';
import ScenarioCard from './scenario-card';

const ScenarioList = ({ scenarios, onEdit, onConfigure, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading scenarios...</p>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Scenarios Found</h3>
        <p className="text-gray-600">No scenarios have been configured yet.</p>
        <p className="text-gray-500 text-sm mt-1">Add a new scenario to get started.</p>
      </div>
    );
  }

  // Sort scenarios by order
  const sortedScenarios = [...scenarios].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Scenarios</h2>
        <div className="text-sm text-gray-600">
          {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} configured
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario._id}
            scenario={scenario}
            onEdit={onEdit}
            onConfigure={onConfigure}
          />
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total</div>
            <div className="font-semibold text-gray-900">{scenarios.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Required</div>
            <div className="font-semibold text-green-600">
              {scenarios.filter(s => s.isRequired).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Optional</div>
            <div className="font-semibold text-gray-600">
              {scenarios.filter(s => !s.isRequired).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Avg Levels</div>
            <div className="font-semibold text-blue-600">
              {scenarios.length > 0 
                ? Math.round(scenarios.reduce((acc, s) => acc + (s.availableLevels?.length || 0), 0) / scenarios.length * 10) / 10
                : 0
              }
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios by Level Availability */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Level Availability</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {['A1', 'A2', 'B1', 'B2'].map(level => (
            <div key={level}>
              <div className="text-gray-600">{level} Level</div>
              <div className="font-semibold text-blue-600">
                {scenarios.filter(s => s.availableLevels?.includes(level)).length} scenarios
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioList;