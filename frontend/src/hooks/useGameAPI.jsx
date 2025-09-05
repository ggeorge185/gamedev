import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { 
    setGames, 
    setActiveGames, 
    setUserGames, 
    setSelectedGame, 
    addGame, 
    updateGame, 
    deleteGame, 
    setLoading, 
    setError 
} from '@/redux/gameSlice';
import { API_ENDPOINTS } from '@/utils/api';

const useGameAPI = () => {
    const dispatch = useDispatch();
    const [loading, setLocalLoading] = useState(false);

    // Helper function to handle API calls
    const handleApiCall = async (apiCall, onSuccess, onError) => {
        try {
            setLocalLoading(true);
            dispatch(setLoading(true));
            dispatch(setError(null));
            
            const response = await apiCall();
            
            if (response.data.success) {
                if (onSuccess) onSuccess(response.data);
            } else {
                throw new Error(response.data.message || 'Operation failed');
            }
            
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
            dispatch(setError(errorMessage));
            if (onError) onError(errorMessage);
            throw error;
        } finally {
            setLocalLoading(false);
            dispatch(setLoading(false));
        }
    };

    // Get all games
    const getAllGames = async (filters = {}) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.games.getAll, { 
                params: filters,
                withCredentials: true 
            }),
            (data) => dispatch(setGames(data.games))
        );
    };

    // Get active games only
    const getActiveGames = async () => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.games.getActive, { withCredentials: true }),
            (data) => dispatch(setActiveGames(data.games))
        );
    };

    // Get user's games
    const getUserGames = async () => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.games.getUserGames, { withCredentials: true }),
            (data) => dispatch(setUserGames(data.games))
        );
    };

    // Get game by ID
    const getGameById = async (gameId) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.games.getById(gameId), { withCredentials: true }),
            (data) => dispatch(setSelectedGame(data.game))
        );
    };

    // Get game by name
    const getGameByName = async (gameName) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.games.getByName(gameName), { withCredentials: true }),
            (data) => dispatch(setSelectedGame(data.game))
        );
    };

    // Create new game
    const createGame = async (gameData) => {
        return handleApiCall(
            () => axios.post(API_ENDPOINTS.games.create, gameData, { withCredentials: true }),
            (data) => {
                dispatch(addGame(data.game));
                dispatch(setSelectedGame(data.game));
            }
        );
    };

    // Update game
    const updateGameData = async (gameId, gameData) => {
        return handleApiCall(
            () => axios.put(API_ENDPOINTS.games.update(gameId), gameData, { withCredentials: true }),
            (data) => {
                dispatch(updateGame(data.game));
                dispatch(setSelectedGame(data.game));
            }
        );
    };

    // Delete game
    const deleteGameData = async (gameId) => {
        return handleApiCall(
            () => axios.delete(API_ENDPOINTS.games.delete(gameId), { withCredentials: true }),
            () => dispatch(deleteGame(gameId))
        );
    };

    // Toggle game status
    const toggleGameStatus = async (gameId) => {
        return handleApiCall(
            () => axios.patch(API_ENDPOINTS.games.toggleStatus(gameId), {}, { withCredentials: true }),
            (data) => dispatch(updateGame(data.game))
        );
    };

    // Search games
    const searchGames = async (searchParams) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.games.search, { 
                params: searchParams,
                withCredentials: true 
            }),
            (data) => dispatch(setGames(data.games))
        );
    };

    return {
        loading,
        getAllGames,
        getActiveGames,
        getUserGames,
        getGameById,
        getGameByName,
        createGame,
        updateGameData,
        deleteGameData,
        toggleGameStatus,
        searchGames
    };
};

export default useGameAPI;