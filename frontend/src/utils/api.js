// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        login: `${API_BASE_URL}/user/login`,
        register: `${API_BASE_URL}/user/register`,
        logout: `${API_BASE_URL}/user/logout`,
        profile: (userId) => `${API_BASE_URL}/user/${userId}/profile`,
    },
    
    // Word endpoints
    words: {
        getAll: `${API_BASE_URL}/word/all`,
        getUserWords: `${API_BASE_URL}/word/user`,
        add: `${API_BASE_URL}/word/add`,
        update: (id) => `${API_BASE_URL}/word/${id}`,
        delete: (id) => `${API_BASE_URL}/word/${id}`,
        search: `${API_BASE_URL}/word/search`,
        getTopics: `${API_BASE_URL}/word/topics`,
    },
    
    // Game endpoints
    games: {
        getAll: `${API_BASE_URL}/game/all`,
        getActive: `${API_BASE_URL}/game/active`,
        getUserGames: `${API_BASE_URL}/game/user`,
        create: `${API_BASE_URL}/game/create`,
        getById: (id) => `${API_BASE_URL}/game/${id}`,
        getByName: (name) => `${API_BASE_URL}/game/name/${name}`,
        update: (id) => `${API_BASE_URL}/game/${id}`,
        delete: (id) => `${API_BASE_URL}/game/${id}`,
        toggleStatus: (id) => `${API_BASE_URL}/game/${id}/toggle-status`,
        search: `${API_BASE_URL}/game/search`,
    },
    
    // Scenario endpoints
    scenarios: {
        getAll: `${API_BASE_URL}/scenario/all`,
        getActive: `${API_BASE_URL}/scenario/active`,
        getUserScenarios: `${API_BASE_URL}/scenario/user`,
        create: `${API_BASE_URL}/scenario/create`,
        getById: (id) => `${API_BASE_URL}/scenario/${id}`,
        getByTopic: (topic) => `${API_BASE_URL}/scenario/topic/${topic}`,
        update: (id) => `${API_BASE_URL}/scenario/${id}`,
        delete: (id) => `${API_BASE_URL}/scenario/${id}`,
        toggleStatus: (id) => `${API_BASE_URL}/scenario/${id}/toggle-status`,
        reorder: `${API_BASE_URL}/scenario/reorder`,
    },
    
    // Scenario Collection endpoints
    scenarioCollections: {
        getAll: `${API_BASE_URL}/scenario-collection/all`,
        getByLevel: (level) => `${API_BASE_URL}/scenario-collection/level/${level}`,
        getDefaultByLevel: (level) => `${API_BASE_URL}/scenario-collection/level/${level}/default`,
        getUserCollections: `${API_BASE_URL}/scenario-collection/user`,
        create: `${API_BASE_URL}/scenario-collection/create`,
        getById: (id) => `${API_BASE_URL}/scenario-collection/${id}`,
        update: (id) => `${API_BASE_URL}/scenario-collection/${id}`,
        delete: (id) => `${API_BASE_URL}/scenario-collection/${id}`,
        toggleStatus: (id) => `${API_BASE_URL}/scenario-collection/${id}/toggle-status`,
        setDefault: (id) => `${API_BASE_URL}/scenario-collection/${id}/set-default`,
    }
};

export default API_ENDPOINTS;