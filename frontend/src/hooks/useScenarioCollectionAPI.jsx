import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { 
    setLoading,
    setError,
    setCollections,
    setUserCollections,
    setCollectionsByLevel,
    setDefaultCollection,
    setSelectedCollection,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionStatus,
    setCollectionAsDefault
} from '@/redux/scenarioCollectionSlice';
import { API_ENDPOINTS } from '@/utils/api';

const useScenarioCollectionAPI = () => {
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

    // Get all scenario collections
    const getAllCollections = async (filters = {}) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarioCollections.getAll, { 
                params: filters,
                withCredentials: true 
            }),
            (data) => dispatch(setCollections(data.collections))
        );
    };

    // Get collections by language level
    const getCollectionsByLevel = async (level, activeOnly = true) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarioCollections.getByLevel(level), { 
                params: { activeOnly },
                withCredentials: true 
            }),
            (data) => dispatch(setCollectionsByLevel({ level, collections: data.collections }))
        );
    };

    // Get default collection for a language level
    const getDefaultCollection = async (level) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarioCollections.getDefaultByLevel(level), { 
                withCredentials: true 
            }),
            (data) => dispatch(setDefaultCollection({ level, collection: data.collection }))
        );
    };

    // Get user's scenario collections
    const getUserCollections = async () => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarioCollections.getUserCollections, { withCredentials: true }),
            (data) => dispatch(setUserCollections(data.collections))
        );
    };

    // Get scenario collection by ID
    const getCollectionById = async (collectionId) => {
        return handleApiCall(
            () => axios.get(API_ENDPOINTS.scenarioCollections.getById(collectionId), { withCredentials: true }),
            (data) => dispatch(setSelectedCollection(data.collection))
        );
    };

    // Create new scenario collection
    const createCollection = async (collectionData) => {
        return handleApiCall(
            () => axios.post(API_ENDPOINTS.scenarioCollections.create, collectionData, { withCredentials: true }),
            (data) => {
                dispatch(addCollection(data.collection));
                dispatch(setSelectedCollection(data.collection));
            }
        );
    };

    // Update scenario collection
    const updateCollectionData = async (collectionId, collectionData) => {
        return handleApiCall(
            () => axios.put(API_ENDPOINTS.scenarioCollections.update(collectionId), collectionData, { withCredentials: true }),
            (data) => {
                dispatch(updateCollection(data.collection));
                dispatch(setSelectedCollection(data.collection));
            }
        );
    };

    // Delete scenario collection
    const deleteCollectionData = async (collectionId) => {
        return handleApiCall(
            () => axios.delete(API_ENDPOINTS.scenarioCollections.delete(collectionId), { withCredentials: true }),
            () => dispatch(deleteCollection(collectionId))
        );
    };

    // Toggle collection status
    const toggleCollectionStatusData = async (collectionId) => {
        return handleApiCall(
            () => axios.patch(API_ENDPOINTS.scenarioCollections.toggleStatus(collectionId), {}, { withCredentials: true }),
            (data) => dispatch(updateCollection(data.collection))
        );
    };

    // Set collection as default for its language level
    const setAsDefault = async (collectionId, languageLevel) => {
        return handleApiCall(
            () => axios.patch(API_ENDPOINTS.scenarioCollections.setDefault(collectionId), {}, { withCredentials: true }),
            (data) => {
                dispatch(updateCollection(data.collection));
                dispatch(setCollectionAsDefault({ collectionId, languageLevel }));
            }
        );
    };

    return {
        loading,
        getAllCollections,
        getCollectionsByLevel,
        getDefaultCollection,
        getUserCollections,
        getCollectionById,
        createCollection,
        updateCollectionData,
        deleteCollectionData,
        toggleCollectionStatusData,
        setAsDefault
    };
};

export default useScenarioCollectionAPI;