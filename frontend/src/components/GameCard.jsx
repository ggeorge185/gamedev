import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
    MoreHorizontal, 
    Trash2, 
    Edit, 
    Clock, 
    Users, 
    Play,
    Pause,
    Settings,
    GamepadIcon
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import useGameAPI from '@/hooks/useGameAPI';

const GameCard = ({ game, showActions = true }) => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { deleteGameData, toggleGameStatus, loading } = useGameAPI();
    const [isEditing, setIsEditing] = useState(false);

    // Check if current user is the author
    const isAuthor = user && game.author && game.author._id === user._id;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this game?')) {
            return;
        }
        try {
            await deleteGameData(game._id);
            toast.success('Game deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete game');
        }
    };

    const handleToggleStatus = async () => {
        try {
            await toggleGameStatus(game._id);
            toast.success(`Game ${game.isActive ? 'deactivated' : 'activated'} successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update game status');
        }
    };


    const difficultyColors = {
        'easy': 'bg-green-100 text-green-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'hard': 'bg-red-100 text-red-800'
    };

    const gameTypeColors = {
        'word-puzzle': 'bg-purple-100 text-purple-800',
        'matching': 'bg-blue-100 text-blue-800',
        'quiz': 'bg-indigo-100 text-indigo-800',
        'memory': 'bg-pink-100 text-pink-800',
        'drag-drop': 'bg-orange-100 text-orange-800',
        'typing': 'bg-cyan-100 text-cyan-800',
        'pronunciation': 'bg-emerald-100 text-emerald-800'
    };

    return (
        <Card className={`w-full h-fit transition-all duration-200 hover:shadow-md ${!game.isActive ? 'opacity-75' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={game.author?.profilePicture} alt={game.author?.username} />
                            <AvatarFallback>
                                {game.author?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{game.author?.username}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(game.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    {showActions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {isAuthor && (
                                    <>
                                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleToggleStatus} disabled={loading}>
                                            {game.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                            {game.isActive ? 'Deactivate' : 'Activate'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleDelete}
                                            disabled={loading}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Game Title and Status */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GamepadIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">{game.displayName}</h3>
                        {!game.isActive && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                                Inactive
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                </div>

                {/* Game Type and Difficulty */}
                <div className="flex items-center justify-between">
                    <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${gameTypeColors[game.gameType] || 'bg-gray-100 text-gray-800'}`}
                    >
                        <Settings className="w-3 h-3" />
                        {game.gameType}
                    </Badge>
                    <Badge className={difficultyColors[game.difficulty] || 'bg-gray-100 text-gray-800'}>
                        {game.difficulty}
                    </Badge>
                </div>

                {/* Game Settings */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="font-medium text-gray-700">Words:</p>
                            <p className="text-gray-600">{game.minWords} - {game.maxWords}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="font-medium text-gray-700">Time:</p>
                            <p className="text-gray-600">{game.formattedTimeLimit || `${Math.floor(game.timeLimit / 60)}m ${game.timeLimit % 60}s`}</p>
                        </div>
                    </div>
                </div>

                {/* Instructions Preview */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Instructions:</p>
                    <p className="text-xs text-gray-600 line-clamp-3">
                        {game.instructions.length > 100 
                            ? `${game.instructions.substring(0, 100)}...` 
                            : game.instructions
                        }
                    </p>
                </div>

            </CardContent>

            {/* Edit Modal - Placeholder for now */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Edit Game</h3>
                        <p className="text-gray-600 mb-4">Game editing form will be implemented here.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default GameCard;