import { createSlice } from "@reduxjs/toolkit";

const scenarioSlice = createSlice({
    name: 'scenario',
    initialState: {
        scenarios: [],
        activeScenarios: [],
        userScenarios: [],
        selectedScenario: null,
        loading: false,
        error: null
    },
    reducers: {
        // Loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        // Error state
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        // Set all scenarios
        setScenarios: (state, action) => {
            state.scenarios = action.payload.sort((a, b) => a.sequence - b.sequence);
            state.error = null;
        },
        
        // Set active scenarios only
        setActiveScenarios: (state, action) => {
            state.activeScenarios = action.payload.sort((a, b) => a.sequence - b.sequence);
            state.error = null;
        },
        
        // Set user's scenarios
        setUserScenarios: (state, action) => {
            state.userScenarios = action.payload.sort((a, b) => a.sequence - b.sequence);
            state.error = null;
        },
        
        // Set selected scenario
        setSelectedScenario: (state, action) => {
            state.selectedScenario = action.payload;
        },
        
        // Add new scenario
        addScenario: (state, action) => {
            const newScenario = action.payload;
            
            // Add to all scenarios and sort by sequence
            state.scenarios.push(newScenario);
            state.scenarios.sort((a, b) => a.sequence - b.sequence);
            
            // Add to user scenarios and sort by sequence
            state.userScenarios.push(newScenario);
            state.userScenarios.sort((a, b) => a.sequence - b.sequence);
            
            // Add to active scenarios if it's active
            if (newScenario.isActive) {
                state.activeScenarios.push(newScenario);
                state.activeScenarios.sort((a, b) => a.sequence - b.sequence);
            }
        },
        
        // Update existing scenario
        updateScenario: (state, action) => {
            const updatedScenario = action.payload;
            
            // Helper function to update scenario in array
            const updateInArray = (array) => {
                const index = array.findIndex(scenario => scenario._id === updatedScenario._id);
                if (index >= 0) {
                    array[index] = updatedScenario;
                    // Re-sort by sequence
                    array.sort((a, b) => a.sequence - b.sequence);
                }
            };
            
            // Update in all arrays
            updateInArray(state.scenarios);
            updateInArray(state.userScenarios);
            
            // Handle active scenarios based on isActive status
            const activeIndex = state.activeScenarios.findIndex(scenario => scenario._id === updatedScenario._id);
            if (updatedScenario.isActive) {
                if (activeIndex >= 0) {
                    // Update existing active scenario
                    state.activeScenarios[activeIndex] = updatedScenario;
                } else {
                    // Add to active scenarios
                    state.activeScenarios.push(updatedScenario);
                }
                state.activeScenarios.sort((a, b) => a.sequence - b.sequence);
            } else {
                // Remove from active scenarios if no longer active
                if (activeIndex >= 0) {
                    state.activeScenarios.splice(activeIndex, 1);
                }
            }
            
            // Update selected scenario if it's the current one
            if (state.selectedScenario && state.selectedScenario._id === updatedScenario._id) {
                state.selectedScenario = updatedScenario;
            }
        },
        
        // Delete scenario
        deleteScenario: (state, action) => {
            const scenarioId = action.payload;
            
            // Remove from all arrays
            state.scenarios = state.scenarios.filter(scenario => scenario._id !== scenarioId);
            state.userScenarios = state.userScenarios.filter(scenario => scenario._id !== scenarioId);
            state.activeScenarios = state.activeScenarios.filter(scenario => scenario._id !== scenarioId);
            
            // Clear selected scenario if it was deleted
            if (state.selectedScenario && state.selectedScenario._id === scenarioId) {
                state.selectedScenario = null;
            }
        },
        
        // Reorder scenarios (for drag and drop)
        reorderScenarios: (state, action) => {
            const reorderedScenarios = action.payload;
            
            // Update all arrays with new order
            state.scenarios = reorderedScenarios.sort((a, b) => a.sequence - b.sequence);
            
            // Update user scenarios if they belong to the user
            state.userScenarios = state.userScenarios.map(userScenario => {
                const updated = reorderedScenarios.find(scenario => scenario._id === userScenario._id);
                return updated || userScenario;
            }).sort((a, b) => a.sequence - b.sequence);
            
            // Update active scenarios
            state.activeScenarios = state.activeScenarios.map(activeScenario => {
                const updated = reorderedScenarios.find(scenario => scenario._id === activeScenario._id);
                return updated || activeScenario;
            }).sort((a, b) => a.sequence - b.sequence);
        },
        
        // Toggle scenario status
        toggleScenarioStatus: (state, action) => {
            const scenarioId = action.payload;
            
            // Helper function to toggle status in array
            const toggleInArray = (array) => {
                const index = array.findIndex(scenario => scenario._id === scenarioId);
                if (index >= 0) {
                    array[index].isActive = !array[index].isActive;
                    return array[index];
                }
                return null;
            };
            
            // Toggle in scenarios and userScenarios
            const updatedScenario = toggleInArray(state.scenarios) || toggleInArray(state.userScenarios);
            
            if (updatedScenario) {
                // Handle active scenarios array
                const activeIndex = state.activeScenarios.findIndex(scenario => scenario._id === scenarioId);
                if (updatedScenario.isActive) {
                    // Add to active scenarios if not already there
                    if (activeIndex === -1) {
                        state.activeScenarios.push(updatedScenario);
                        state.activeScenarios.sort((a, b) => a.sequence - b.sequence);
                    }
                } else {
                    // Remove from active scenarios
                    if (activeIndex >= 0) {
                        state.activeScenarios.splice(activeIndex, 1);
                    }
                }
            }
        },
        
        // Set scenarios by topic
        setScenariosByTopic: (state, action) => {
            const { topic, scenarios } = action.payload;
            state.scenarios = scenarios.sort((a, b) => a.sequence - b.sequence);
            state.currentTopic = topic;
            state.error = null;
        },
        
        // Clear all scenario data (for logout)
        clearScenarios: (state) => {
            state.scenarios = [];
            state.activeScenarios = [];
            state.userScenarios = [];
            state.selectedScenario = null;
            state.loading = false;
            state.error = null;
            state.currentTopic = null;
        }
    }
});

export const { 
    setLoading,
    setError,
    setScenarios, 
    setActiveScenarios,
    setUserScenarios,
    setSelectedScenario, 
    addScenario, 
    updateScenario, 
    deleteScenario,
    reorderScenarios,
    toggleScenarioStatus,
    setScenariosByTopic,
    clearScenarios
} = scenarioSlice.actions;

export default scenarioSlice.reducer;