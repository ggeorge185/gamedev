import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
    MoreHorizontal, 
    Trash2, 
    Edit, 
    Clock, 
    Play,
    Pause,
    BookOpen,
    Target
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const ScenarioCard = ({ scenario, showActions = true, isDragging = false, dragHandleProps = {} }) => {
    const { user } = useSelector(store => store.auth);
    const [isEditing, setIsEditing] = useState(false);

    // Check if current user is the author (simplified check)
    const isAuthor = user && scenario.author && (scenario.author._id === user._id || scenario.author === user._id);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this scenario?')) {
            return;
        }
        toast.info('Delete functionality would be implemented here');
    };

    const handleToggleStatus = async () => {
        toast.info('Toggle status functionality would be implemented here');
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
        <Card className={`w-full h-fit transition-all duration-200 hover:shadow-md ${!scenario.isRequired ? 'opacity-75' : ''} ${isDragging ? 'rotate-2 shadow-lg' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Order/Sequence Number */}
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            {scenario.order || 1}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                                {scenario.name?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div>
                                <p className="font-medium text-sm">Admin</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(scenario.createdAt || Date.now()).toLocaleDateString()}
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
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleToggleStatus}>
                                    {scenario.isRequired ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                    {scenario.isRequired ? 'Make Optional' : 'Make Required'}
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
                {/* Scenario Title and Status */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">{scenario.name}</h3>
                        {!scenario.isRequired && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                                Optional
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scenario.description}</p>
                </div>

                {/* Story Context */}
                {scenario.storyContext && (
                    <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Story Context:</p>
                        <p className="text-gray-600 text-xs line-clamp-2">{scenario.storyContext}</p>
                    </div>
                )}

                {/* Available Levels */}
                {scenario.availableLevels && scenario.availableLevels.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Available Levels:</p>
                        <div className="flex flex-wrap gap-1">
                            {scenario.availableLevels.map((level, index) => (
                                <Badge key={index} className={languageLevelColors[level] || 'bg-gray-100 text-gray-800'}>
                                    {level}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Map Position */}
                {scenario.mapPosition && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>Position: ({scenario.mapPosition.x}, {scenario.mapPosition.y})</span>
                    </div>
                )}
            </CardContent>

            {/* Edit Modal - Placeholder for now */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Edit Scenario</h3>
                        <p className="text-gray-600 mb-4">Scenario editing form would be implemented here.</p>
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