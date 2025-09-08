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
    Hash,
    Play,
    Pause,
    BookOpen,
    Target,
    GripVertical
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import useScenarioAPI from '@/hooks/useScenarioAPI';

const ScenarioCard = ({ scenario, showActions = true, isDragging = false, dragHandleProps = {} }) => {
    const { user } = useSelector(store => store.auth);
    const { deleteScenarioData, toggleScenarioStatus, loading } = useScenarioAPI();
    const [isEditing, setIsEditing] = useState(false);

    // Check if current user is the author
    const isAuthor = user && scenario.author && scenario.author._id === user._id;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this scenario?')) {
            return;
        }
        try {
            await deleteScenarioData(scenario._id);
            toast.success('Scenario deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete scenario');
        }
    };

    const handleToggleStatus = async () => {
        try {
            await toggleScenarioStatus(scenario._id);
            toast.success(`Scenario ${scenario.isActive ? 'deactivated' : 'activated'} successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update scenario status');
        }
    };

    const languageLevelColors = {
        'A1': 'bg-green-100 text-green-800',
        'A2': 'bg-green-200 text-green-900',
        'B1': 'bg-blue-100 text-blue-800',
        'B2': 'bg-blue-200 text-blue-900',
        'C1': 'bg-purple-100 text-purple-800',
        'C2': 'bg-purple-200 text-purple-900'
    };


    return (
        <Card className={`w-full h-fit transition-all duration-200 hover:shadow-md ${!scenario.isActive ? 'opacity-75' : ''} ${isDragging ? 'rotate-2 shadow-lg' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Drag Handle */}
                        {showActions && isAuthor && (
                            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </div>
                        )}
                        
                        {/* Sequence Number */}
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            {scenario.sequence}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={scenario.author?.profilePicture} alt={scenario.author?.username} />
                                <AvatarFallback>
                                    {scenario.author?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">{scenario.author?.username}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(scenario.createdAt).toLocaleDateString()}
                                </p>
                            </div>
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
                                            {scenario.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                            {scenario.isActive ? 'Deactivate' : 'Activate'}
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
                {/* Scenario Title and Status */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">{scenario.name}</h3>
                        {!scenario.isActive && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                                Inactive
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scenario.story}</p>
                </div>

                {/* Topic Info */}
                <div className="flex items-center justify-center">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {scenario.topic}
                    </Badge>
                </div>

                {/* Levels Overview */}
                {scenario.levels && scenario.levels.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-700">Levels ({scenario.levels.length})</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>{scenario.formattedTotalDuration || `${scenario.levels.reduce((total, level) => total + (level.estimatedDuration || 0), 0)}m`}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                            {scenario.levels.map((level, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Badge className={languageLevelColors[level.languageLevel] || 'bg-gray-100 text-gray-800'}>
                                            {level.languageLevel}
                                        </Badge>
                                    </div>
                                    
                                    <div className="text-xs text-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                {level.selectedGameId?.displayName || 'Unknown Game'}
                                            </span>
                                            {level.selectedGameId?.gameType && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {level.selectedGameId.gameType}
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {level.estimatedDuration >= 60 
                                                    ? `${Math.floor(level.estimatedDuration / 60)}h ${level.estimatedDuration % 60}m`
                                                    : `${level.estimatedDuration}m`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Summary for multiple levels */}
                        {scenario.levels.length > 1 && (
                            <div className="flex flex-wrap gap-1 justify-center pt-2 border-t border-gray-200">
                                <span className="text-xs text-gray-500">Levels: </span>
                                {[...new Set(scenario.levels.map(level => level.languageLevel))].sort().map(level => (
                                    <Badge key={level} variant="outline" className="text-xs">
                                        {level}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Fallback for scenarios without levels (backward compatibility) */}
                {(!scenario.levels || scenario.levels.length === 0) && (
                    <>
                        <div className="flex items-center justify-center">
                            <Badge className={languageLevelColors[scenario.languageLevel] || 'bg-gray-100 text-gray-800'}>
                                {scenario.languageLevel}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Game:</p>
                                <p className="text-gray-600">{scenario.selectedGameId?.displayName || 'Unknown Game'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{scenario.formattedDuration || `${scenario.estimatedDuration}m`}</span>
                        </div>

                        {scenario.selectedGameId?.gameType && (
                            <div className="text-center pt-2">
                                <Badge variant="secondary">
                                    {scenario.selectedGameId.gameType}
                                </Badge>
                            </div>
                        )}
                    </>
                )}
            </CardContent>

            {/* Edit Modal - Placeholder for now */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Edit Scenario</h3>
                        <p className="text-gray-600 mb-4">Scenario editing form will be implemented here.</p>
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

export default ScenarioCard;