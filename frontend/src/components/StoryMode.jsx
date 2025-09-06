import React from "react";
import { CheckCircle, MapPin } from "lucide-react";

const StoryMode = ({
  scenarios = [],
  isScenarioCompleted = () => false,
  isScenarioUnlocked = () => false,
  getScenarioCompletionCount = () => 0,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Germany Map</h2>
      <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden">
        {/* Map Background Image */}
        <img
          src="/image.jpg"
          alt="Map background"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ zIndex: 0 }}
        />
        {/* Map Background SVG */}
        <div className="absolute inset-0 opacity-20" style={{ zIndex: 1 }}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Simple Germany outline */}
            <path
              d="M20,20 L80,20 L85,30 L80,50 L75,80 L25,85 L15,70 L20,20 Z"
              fill="currentColor"
              className="text-gray-400"
            />
          </svg>
        </div>
        {/* Scenario Markers */}
        {scenarios.map((scenario) => {
          // Defensive: skip if no mapPosition or missing x/y
          if (
            !scenario.mapPosition ||
            typeof scenario.mapPosition.x !== "number" ||
            typeof scenario.mapPosition.y !== "number"
          ) {
            return null;
          }
          const isCompleted = isScenarioCompleted(scenario._id);
          const isUnlocked = isScenarioUnlocked(scenario);
          const completionCount = getScenarioCompletionCount(scenario._id);

          // Calculate absolute positioning
          const left = `${scenario.mapPosition.x}%`;
          const top = `${scenario.mapPosition.y}%`;

          return (
            <button
              key={scenario._id}
              className="absolute flex flex-col items-center group"
              style={{ left, top, zIndex: 2, transform: "translate(-50%, -50%)" }}
              disabled={!isUnlocked}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-200 ${
                    isUnlocked
                      ? isCompleted
                        ? "border-green-500 bg-green-100"
                        : "border-blue-500 bg-blue-100"
                      : "border-gray-400 bg-gray-200 opacity-60"
                  }`}
                >
                  {/* Marker Icon */}
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <MapPin className="w-6 h-6" />
                  )}
                </div>
                {/* Completion stars */}
                {completionCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-yellow-900">
                    {completionCount}
                  </div>
                )}
                {/* Scenario name */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium text-gray-800 whitespace-nowrap">
                  {scenario.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
};

export default StoryMode;
