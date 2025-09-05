import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        games: [],
        activeGames: [],
        userGames: [],
        selectedGame: null,
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
        
        // Set all games
        setGames: (state, action) => {
            state.games = action.payload;
            state.error = null;
        },
        
        // Set active games only
        setActiveGames: (state, action) => {
            state.activeGames = action.payload;
            state.error = null;
        },
        
        // Set user's games
        setUserGames: (state, action) => {
            state.userGames = action.payload;
            state.error = null;
        },
        
        // Set selected game
        setSelectedGame: (state, action) => {
            state.selectedGame = action.payload;
        },
        
        // Add new game
        addGame: (state, action) => {
            const newGame = action.payload;
            state.games.unshift(newGame);
            state.userGames.unshift(newGame);
            if (newGame.isActive) {
                state.activeGames.unshift(newGame);
            }
        },
        
        // Update existing game
        updateGame: (state, action) => {
            const updatedGame = action.payload;
            
            // Update in all games
            state.games = state.games.map(game => 
                game._id === updatedGame._id ? updatedGame : game
            );
            
            // Update in user games
            state.userGames = state.userGames.map(game => 
                game._id === updatedGame._id ? updatedGame : game
            );
            
            // Update in active games
            if (updatedGame.isActive) {
                // If game is now active, add or update it
                const existingIndex = state.activeGames.findIndex(game => game._id === updatedGame._id);
                if (existingIndex >= 0) {
                    state.activeGames[existingIndex] = updatedGame;
                } else {
                    state.activeGames.unshift(updatedGame);
                }
            } else {
                // If game is now inactive, remove it from active games
                state.activeGames = state.activeGames.filter(game => game._id !== updatedGame._id);
            }
            
            // Update selected game if it's the current one
            if (state.selectedGame && state.selectedGame._id === updatedGame._id) {
                state.selectedGame = updatedGame;
            }
        },
        
        // Delete game
        deleteGame: (state, action) => {
            const gameId = action.payload;
            state.games = state.games.filter(game => game._id !== gameId);
            state.userGames = state.userGames.filter(game => game._id !== gameId);
            state.activeGames = state.activeGames.filter(game => game._id !== gameId);
            
            // Clear selected game if it was deleted
            if (state.selectedGame && state.selectedGame._id === gameId) {
                state.selectedGame = null;
            }
        },
        
        // Toggle game status
        toggleGameStatus: (state, action) => {
            const gameId = action.payload;
            
            // Find and update the game in all relevant arrays
            [state.games, state.userGames].forEach(gameArray => {
                const gameIndex = gameArray.findIndex(game => game._id === gameId);
                if (gameIndex >= 0) {
                    gameArray[gameIndex].isActive = !gameArray[gameIndex].isActive;
                }
            });
            
            // Handle active games array
            const game = state.games.find(g => g._id === gameId);
            if (game) {
                if (game.isActive) {
                    // Add to active games if not already there
                    const existsInActive = state.activeGames.some(g => g._id === gameId);
                    if (!existsInActive) {
                        state.activeGames.unshift(game);
                    }
                } else {
                    // Remove from active games
                    state.activeGames = state.activeGames.filter(g => g._id !== gameId);
                }
            }
        },
        
        // Clear all game data (for logout)
        clearGames: (state) => {
            state.games = [];
            state.activeGames = [];
            state.userGames = [];
            state.selectedGame = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { 
    setLoading,
    setError,
    setGames, 
    setActiveGames,
    setUserGames,
    setSelectedGame, 
    addGame, 
    updateGame, 
    deleteGame,
    toggleGameStatus,
    clearGames
} = gameSlice.actions;

export default gameSlice.reducer;