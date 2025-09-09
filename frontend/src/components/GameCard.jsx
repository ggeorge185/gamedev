import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const GameCard = ({ game, showActions = true }) => {
    const { user } = useSelector(store => store.auth);
    const [isEditing, setIsEditing] = useState(false);

    // Check if current user is the author (simplified check)
    const isAuthor = user && game.author && (game.author._id === user._id || game.author === user._id);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this game?')) {
            return;
        }
        toast.info('Delete functionality would be implemented here');
    };

    const handleToggleStatus = async () => {
        toast.info('Toggle status functionality would be implemented here');
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
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                            {game.name?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <div>
                            <p className="font-medium text-sm">Admin</p>
                            <p className="text-xs text-gray-500">
                                {new Date(game.createdAt || Date.now()).toLocaleDateString()}
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
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleToggleStatus}>
                                    {game.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                    {game.isActive ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleDelete}
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
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
                        <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
                        {!game.isActive && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                                Inactive
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                </div>

                {/* Game Type and Config */}
                <div className="flex items-center justify-between">
                    <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${gameTypeColors[game.componentName] || 'bg-gray-100 text-gray-800'}`}
                    >
                        <Settings className="w-3 h-3" />
                        {game.componentName || 'Unknown'}
                    </Badge>
                    {game.configOptions && (
                        <Badge className="bg-blue-100 text-blue-800">
                            Configured
                        </Badge>
                    )}
                </div>

                {/* Game Configuration Info */}
                {game.configOptions && (
                    <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Configuration:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            {Object.entries(game.configOptions).map(([key, value]) => (
                                <div key={key}>
                                    <span className="font-medium">{key}:</span> {value}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </CardContent>

            {/* Edit Modal - Placeholder for now */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Edit Game</h3>
                        <p className="text-gray-600 mb-4">Game editing form would be implemented here.</p>
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