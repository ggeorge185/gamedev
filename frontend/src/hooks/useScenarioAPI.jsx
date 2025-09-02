import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { 
    setScenarios, 
    setActiveScenarios, 
    setUserScenarios, 
    setSelectedScenario, 
    addScenario, 
    updateScenario, 
    deleteScenario, 
    reorderScenarios,
    setScenariosByTopic,
    setLoading, 
    setError 
} from '@/redux/scenarioSlice';
import { API_ENDPOINTS } from '@/utils/api';

const useScenarioAPI = () => {
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

    // Get all scenarios
    const getAllScenarios = async (filters = {}) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarios.getAll, { 
                params: filters,
                withCredentials: true 
            }),
            (data) => dispatch(setScenarios(data.scenarios))
        );
    };

    // Get active scenarios only
    const getActiveScenarios = async () => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarios.getActive, { withCredentials: true }),
            (data) => dispatch(setActiveScenarios(data.scenarios))
        );
    };

    // Get user's scenarios
    const getUserScenarios = async () => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarios.getUserScenarios, { withCredentials: true }),
            (data) => dispatch(setUserScenarios(data.scenarios))
        );
    };

    // Get scenario by ID
    const getScenarioById = async (scenarioId) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarios.getById(scenarioId), { withCredentials: true }),
            (data) => dispatch(setSelectedScenario(data.scenario))
        );
    };

    // Get scenarios by topic
    const getScenariosByTopic = async (topic, filters = {}) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarios.getByTopic(topic), { 
                params: filters,
                withCredentials: true 
            }),
            (data) => dispatch(setScenariosByTopic({ topic: data.topic, scenarios: data.scenarios }))
        );
    };

    // Create new scenario
    const createScenario = async (scenarioData) => {
        return handleApiCall(
            () => axios.post(API_ENDPOINTS.scenarios.create, scenarioData, { withCredentials: true }),
            (data) => {
                dispatch(addScenario(data.scenario));
                dispatch(setSelectedScenario(data.scenario));
            }
        );
    };

    // Update scenario
    const updateScenarioData = async (scenarioId, scenarioData) => {
        return handleApiCall(
            () => axios.put(API_ENDPOINTS.scenarios.update(scenarioId), scenarioData, { withCredentials: true }),
            (data) => {
                dispatch(updateScenario(data.scenario));
                dispatch(setSelectedScenario(data.scenario));
            }
        );
    };

    // Delete scenario
    const deleteScenarioData = async (scenarioId) => {
        return handleApiCall(
            () => axios.delete(API_ENDPOINTS.scenarios.delete(scenarioId), { withCredentials: true }),
            () => dispatch(deleteScenario(scenarioId))
        );
    };

    // Toggle scenario status
    const toggleScenarioStatus = async (scenarioId) => {
        return handleApiCall(
            () => axios.patch(API_ENDPOINTS.scenarios.toggleStatus(scenarioId), {}, { withCredentials: true }),
            (data) => dispatch(updateScenario(data.scenario))
        );
    };

    // Reorder scenarios
    const reorderScenariosData = async (reorderData) => {
        return handleApiCall(
            () => axios.put(API_ENDPOINTS.scenarios.reorder, { reorderData }, { withCredentials: true }),
            (data) => dispatch(reorderScenarios(data.scenarios))
        );
    };

    return {
        loading,
        getAllScenarios,
        getActiveScenarios,
        getUserScenarios,
        getScenarioById,
        getScenariosByTopic,
        createScenario,
        updateScenarioData,
        deleteScenarioData,
        toggleScenarioStatus,
        reorderScenariosData
    };
};

export default useScenarioAPI;