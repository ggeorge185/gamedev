import { createSlice } from "@reduxjs/toolkit";

const wordSlice = createSlice({
    name: 'word',
    initialState: {
        words: [],
        selectedWord: null,
        userWords: []
    },
    reducers: {
        setWords: (state, action) => {
            state.words = action.payload;
        },
        setSelectedWord: (state, action) => {
            state.selectedWord = action.payload;
        },
        setUserWords: (state, action) => {
            state.userWords = action.payload;
        },
        addWord: (state, action) => {
            state.words.unshift(action.payload);
            state.userWords.unshift(action.payload);
        },
        updateWord: (state, action) => {
            const updatedWord = action.payload;
            state.words = state.words.map(word => 
                word._id === updatedWord._id ? updatedWord : word
            );
            state.userWords = state.userWords.map(word => 
                word._id === updatedWord._id ? updatedWord : word
            );
        },
        deleteWord: (state, action) => {
            const wordId = action.payload;
            state.words = state.words.filter(word => word._id !== wordId);
            state.userWords = state.userWords.filter(word => word._id !== wordId);
        }
    }
});

export const { 
    setWords, 
    setSelectedWord, 
    setUserWords, 
    addWord, 
    updateWord, 
    deleteWord 
} = wordSlice.actions;

export default wordSlice.reducer;