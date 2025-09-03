import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const GameProtectedRoutes = ({ children }) => {
    const { gameUser } = useSelector(store => store.gameAuth);
    
    if (!gameUser) {
        return <Navigate to="/game-login" />
    }
    
    return children;
}

export default GameProtectedRoutes