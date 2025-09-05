import React from 'react';
import { Target } from 'lucide-react';
import ScenarioCollectionCard from './scenario-collection-card.jsx';

const ScenarioCollectionList = ({ collections, onEdit, onConfigure, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading scenario configurations...</p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Configurations Found</h3>
        <p className="text-gray-600">No scenario-game configurations have been set up yet.</p>
        <p className="text-gray-500 text-sm mt-1">Create configurations to assign games to scenario levels.</p>
      </div>
    );
  }

  // Group collections by scenario
  const groupedCollections = collections.reduce((acc, collection) => {
    const scenarioName = collection.scenario?.name || 'Unknown Scenario';
    if (!acc[scenarioName]) {
      acc[scenarioName] = [];
    }
    acc[scenarioName].push(collection);
    return acc;
  }, {});

  // Sort collections within each group by difficulty level
  Object.keys(groupedCollections).forEach(scenarioName => {
    groupedCollections[scenarioName].sort((a, b) => {
      const levelOrder = ['A1', 'A2', 'B1', 'B2'];
      return levelOrder.indexOf(a.difficultyLevel) - levelOrder.indexOf(b.difficultyLevel);
    });
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Scenario Configurations</h2>
        <div className="text-sm text-gray-600">
          {collections.length} configuration{collections.length !== 1 ? 's' : ''} set up
        </div>
      </div>

      {/* Grouped Display */}
      <div className="space-y-6">
        {Object.entries(groupedCollections).map(([scenarioName, scenarioCollections]) => (
          <div key={scenarioName} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              {scenarioName}
              <span className="text-sm font-normal text-gray-500">
                ({scenarioCollections.length} level{scenarioCollections.length !== 1 ? 's' : ''})
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scenarioCollections.map((collection) => (
                <ScenarioCollectionCard
                  key={collection._id}
                  collection={collection}
                  onEdit={onEdit}
                  onConfigure={onConfigure}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Configuration Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Configs</div>
            <div className="font-semibold text-gray-900">{collections.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Active</div>
            <div className="font-semibold text-green-600">
              {collections.filter(c => c.isActive).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Scenarios</div>
            <div className="font-semibold text-blue-600">
              {Object.keys(groupedCollections).length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Avg per Scenario</div>
            <div className="font-semibold text-purple-600">
              {Object.keys(groupedCollections).length > 0 
                ? Math.round(collections.length / Object.keys(groupedCollections).length * 10) / 10
                : 0
              }
            </div>
          </div>
        </div>
      </div>

      {/* Game Type Usage */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Game Type Usage</h3>
        <div className="space-y-1">
          {(() => {
            const gameUsage = collections.reduce((acc, collection) => {
              const gameName = collection.gameType?.name || 'Unassigned';
              acc[gameName] = (acc[gameName] || 0) + 1;
              return acc;
            }, {});

            return Object.entries(gameUsage).map(([gameName, count]) => (
              <div key={gameName} className="flex justify-between text-sm">
                <span className="text-gray-700">{gameName}:</span>
                <span className="font-medium text-blue-600">{count} assignment{count !== 1 ? 's' : ''}</span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Level Distribution */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Level Distribution</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {['A1', 'A2', 'B1', 'B2'].map(level => (
            <div key={level}>
              <div className="text-gray-600">{level} Level</div>
              <div className="font-semibold text-green-600">
                {collections.filter(c => c.difficultyLevel === level).length} configs
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioCollectionList;