import { createSlice } from "@reduxjs/toolkit";

const gameAuthSlice = createSlice({
    name: "gameAuth",
    initialState: {
        gameUser: null,
        scenarios: [],
        gameTypes: [],
        scenarioConfigs: [],
    },
    reducers: {
        setGameAuthUser: (state, action) => {
            state.gameUser = action.payload;
        },
        setScenarios: (state, action) => {
            state.scenarios = action.payload;
        },
        setGameTypes: (state, action) => {
            state.gameTypes = action.payload;
        },
        setScenarioConfigs: (state, action) => {
            state.scenarioConfigs = action.payload;
        },
        updateGameUserProgress: (state, action) => {
            if (state.gameUser) {
                const { scenarioId, difficultyLevel, score } = action.payload;
                
                // Check if scenario is already completed
                const existingIndex = state.gameUser.completedScenarios.findIndex(
                    cs => cs.scenarioId === scenarioId && cs.difficultyLevel === difficultyLevel
                );
                
                if (existingIndex === -1) {
                    // Add new completion
                    state.gameUser.completedScenarios.push({
                        scenarioId,
                        difficultyLevel,
                        score,
                        completedAt: new Date().toISOString()
                    });
                } else {
                    // Update existing completion with better score
                    if (score > state.gameUser.completedScenarios[existingIndex].score) {
                        state.gameUser.completedScenarios[existingIndex].score = score;
                        state.gameUser.completedScenarios[existingIndex].completedAt = new Date().toISOString();
                    }
                }
                
                // Check if story mode is completed (all required scenarios completed)
                const requiredScenarios = state.scenarios.filter(s => s.isRequired);
                const completedRequiredScenarios = new Set(
                    state.gameUser.completedScenarios.map(cs => cs.scenarioId)
                );
                
                if (requiredScenarios.every(scenario => 
                    completedRequiredScenarios.has(scenario._id)
                )) {
                    state.gameUser.storyModeCompleted = true;
                }
            }
        },
    },
});

export const {
    setGameAuthUser,
    setScenarios,
    setGameTypes,
    setScenarioConfigs,
    updateGameUserProgress,
} = gameAuthSlice.actions;

export default gameAuthSlice.reducer;