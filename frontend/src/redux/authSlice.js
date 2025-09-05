import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        followUser: (state, action) => {
            state.userProfile.followers.push(action.payload);
            state.user.following.push(action.payload);
        },
        unfollowUser: (state, action) => {
            state.userProfile.followers = state.userProfile.followers.filter(
                (userId) => userId !== action.payload
            );
            state.user.following = state.user.following.filter(
                (userId) => userId !== action.payload
            );
        },
    },
});

export const {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile,
    setSelectedUser,
    followUser,
    unfollowUser,
} = authSlice.actions;

export default authSlice.reducer;
