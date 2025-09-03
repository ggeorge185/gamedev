import { createSlice } from "@reduxjs/toolkit";

const scenarioCollectionSlice = createSlice({
    name: 'scenarioCollection',
    initialState: {
        collections: [],
        userCollections: [],
        collectionsByLevel: {},
        defaultCollections: {},
        selectedCollection: null,
        loading: false,
        error: null
    },
    reducers: {
        // Loading and error states
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        clearError: (state) => {
            state.error = null;
        },
        
        // Set all collections
        setCollections: (state, action) => {
            state.collections = action.payload;
            state.error = null;
        },
        
        // Set user's collections
        setUserCollections: (state, action) => {
            state.userCollections = action.payload;
            state.error = null;
        },
        
        // Set collections by language level
        setCollectionsByLevel: (state, action) => {
            const { level, collections } = action.payload;
            state.collectionsByLevel[level] = collections;
            state.error = null;
        },
        
        // Set default collection for a language level
        setDefaultCollection: (state, action) => {
            const { level, collection } = action.payload;
            state.defaultCollections[level] = collection;
            state.error = null;
        },
        
        // Set selected collection
        setSelectedCollection: (state, action) => {
            state.selectedCollection = action.payload;
        },
        
        // Add new collection
        addCollection: (state, action) => {
            const newCollection = action.payload;
            state.collections.unshift(newCollection);
            state.userCollections.unshift(newCollection);
            
            // Add to level-specific collections if cached
            const level = newCollection.languageLevel;
            if (state.collectionsByLevel[level]) {
                state.collectionsByLevel[level].unshift(newCollection);
            }
        },
        
        // Update existing collection
        updateCollection: (state, action) => {
            const updatedCollection = action.payload;
            
            // Update in all collections
            state.collections = state.collections.map(collection => 
                collection._id === updatedCollection._id ? updatedCollection : collection
            );
            
            // Update in user collections
            state.userCollections = state.userCollections.map(collection => 
                collection._id === updatedCollection._id ? updatedCollection : collection
            );
            
            // Update in level-specific collections
            Object.keys(state.collectionsByLevel).forEach(level => {
                state.collectionsByLevel[level] = state.collectionsByLevel[level].map(collection =>
                    collection._id === updatedCollection._id ? updatedCollection : collection
                );
            });
            
            // Update default collections if applicable
            if (updatedCollection.isDefault) {
                state.defaultCollections[updatedCollection.languageLevel] = updatedCollection;
            }
            
            // Update selected collection if it's the current one
            if (state.selectedCollection && state.selectedCollection._id === updatedCollection._id) {
                state.selectedCollection = updatedCollection;
            }
        },
        
        // Delete collection
        deleteCollection: (state, action) => {
            const collectionId = action.payload;
            
            // Remove from all collections
            state.collections = state.collections.filter(collection => collection._id !== collectionId);
            state.userCollections = state.userCollections.filter(collection => collection._id !== collectionId);
            
            // Remove from level-specific collections
            Object.keys(state.collectionsByLevel).forEach(level => {
                state.collectionsByLevel[level] = state.collectionsByLevel[level].filter(collection =>
                    collection._id !== collectionId
                );
            });
            
            // Remove from default collections if applicable
            Object.keys(state.defaultCollections).forEach(level => {
                if (state.defaultCollections[level] && state.defaultCollections[level]._id === collectionId) {
                    delete state.defaultCollections[level];
                }
            });
            
            // Clear selected collection if it was deleted
            if (state.selectedCollection && state.selectedCollection._id === collectionId) {
                state.selectedCollection = null;
            }
        },
        
        // Toggle collection status
        toggleCollectionStatus: (state, action) => {
            const { collectionId, isActive } = action.payload;
            
            // Update in all arrays
            const updateStatus = (collection) => {
                if (collection._id === collectionId) {
                    return { ...collection, isActive };
                }
                return collection;
            };
            
            state.collections = state.collections.map(updateStatus);
            state.userCollections = state.userCollections.map(updateStatus);
            
            Object.keys(state.collectionsByLevel).forEach(level => {
                state.collectionsByLevel[level] = state.collectionsByLevel[level].map(updateStatus);
            });
            
            // Update selected collection if applicable
            if (state.selectedCollection && state.selectedCollection._id === collectionId) {
                state.selectedCollection.isActive = isActive;
            }
        },
        
        // Set collection as default
        setCollectionAsDefault: (state, action) => {
            const { collectionId, languageLevel } = action.payload;
            
            // Update isDefault status for all collections of the same level
            const updateDefaultStatus = (collection) => {
                if (collection.languageLevel === languageLevel) {
                    return { ...collection, isDefault: collection._id === collectionId };
                }
                return collection;
            };
            
            state.collections = state.collections.map(updateDefaultStatus);
            state.userCollections = state.userCollections.map(updateDefaultStatus);
            
            if (state.collectionsByLevel[languageLevel]) {
                state.collectionsByLevel[languageLevel] = state.collectionsByLevel[languageLevel].map(updateDefaultStatus);
            }
            
            // Update default collection for this level
            const newDefaultCollection = state.collections.find(c => c._id === collectionId);
            if (newDefaultCollection) {
                state.defaultCollections[languageLevel] = newDefaultCollection;
            }
        },
        
        // Clear all data (for logout)
        clearCollections: (state) => {
            state.collections = [];
            state.userCollections = [];
            state.collectionsByLevel = {};
            state.defaultCollections = {};
            state.selectedCollection = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { 
    setLoading,
    setError,
    clearError,
    setCollections,
    setUserCollections,
    setCollectionsByLevel,
    setDefaultCollection,
    setSelectedCollection,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionStatus,
    setCollectionAsDefault,
    clearCollections
} = scenarioCollectionSlice.actions;

export default scenarioCollectionSlice.reducer;