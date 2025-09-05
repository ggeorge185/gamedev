import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import wordSlice from './wordSlice.js';
<<<<<<< HEAD
import gameSlice from './gameSlice.js';
import scenarioSlice from './scenarioSlice.js';
import scenarioCollectionSlice from './scenarioCollectionSlice.js';
=======
import gameAuthSlice from './gameAuthSlice.js';
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e

import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    word:wordSlice,
<<<<<<< HEAD
    game:gameSlice,
    scenario:scenarioSlice,
    scenarioCollection:scenarioCollectionSlice,
=======
    gameAuth:gameAuthSlice,
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;