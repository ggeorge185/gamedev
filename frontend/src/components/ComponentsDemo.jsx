import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import GamesComponent from './games-component';
import ScenariosComponent from './scenarios-component';
import ScenarioCollections from './scenario-collections';
import Scenarios from './scenarios';
import { GamepadIcon, BookOpen, Target, Settings } from 'lucide-react';

const ComponentsDemo = () => {
  const [activeTab, setActiveTab] = useState('games');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GameDev Components Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Demonstrating the requested components structure with A1-C2 level support
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="games" className="flex items-center gap-2">
              <GamepadIcon className="w-4 h-4" />
              Games Component
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="scenarios-admin" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Scenarios Admin
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Collections
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="games">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Games Component (@games-component.jsx)</h2>
              <p className="text-gray-600 mb-4">
                Includes: @game-card.jsx, @game-form.jsx, @game-list.jsx, @games-component.jsx
              </p>
            </div>
            <GamesComponent />
          </TabsContent>
          
          <TabsContent value="scenarios">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Scenarios Component (@scenarios.jsx)</h2>
              <p className="text-gray-600 mb-4">
                New scenarios.jsx component with A1-C2 level support
              </p>
            </div>
            <Scenarios />
          </TabsContent>
          
          <TabsContent value="scenarios-admin">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Scenarios Admin (@scenarios-component.jsx)</h2>
              <p className="text-gray-600 mb-4">
                Includes: @scenario-card.jsx, @scenario-form.jsx, @scenario-list.jsx
              </p>
            </div>
            <ScenariosComponent />
          </TabsContent>
          
          <TabsContent value="collections">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Scenario Collections (@scenario-collections.jsx)</h2>
              <p className="text-gray-600 mb-4">
                Includes: @scenario-collection-card.jsx, @scenario-collection-form.jsx, @scenario-collection-list.jsx<br/>
                Shows game selection for scenarios with A1-C2 levels
              </p>
            </div>
            <ScenarioCollections />
          </TabsContent>
        </Tabs>

        {/* Component Files Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">✅ Implemented Component Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Games Components:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ @game-card.jsx</li>
                <li>✅ @game-form.jsx</li>
                <li>✅ @game-list.jsx</li>
                <li>✅ @games-component.jsx</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Scenarios Components:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ @scenario-card.jsx</li>
                <li>✅ @scenario-collection-card.jsx</li>
                <li>✅ @scenario-collection-form.jsx</li>
                <li>✅ @scenario-collection-list.jsx</li>
                <li>✅ @scenario-collections.jsx</li>
                <li>✅ @scenario-form.jsx</li>
                <li>✅ @scenario-list.jsx</li>
                <li>✅ @scenarios.jsx <span className="text-green-600 font-semibold">(NEW)</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Enhanced Features:</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>🎯 Extended level support from A1-B2 to <strong>A1-C2</strong></li>
              <li>🎮 Game selection functionality for scenarios</li>
              <li>📱 Responsive design with proper grid layouts</li>
              <li>🔧 Admin components for complete management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsDemo;