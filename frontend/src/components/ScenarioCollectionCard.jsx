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
    Library,
    Star,
    Crown,
    Users
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import useScenarioCollectionAPI from '@/hooks/useScenarioCollectionAPI';

const ScenarioCollectionCard = ({ collection, showActions = true, onEdit = null }) => {
    const { user } = useSelector(store => store.auth);
    const { deleteCollectionData, toggleCollectionStatusData, setAsDefault, loading } = useScenarioCollectionAPI();
    const [isEditing, setIsEditing] = useState(false);

    // Check if current user is the author
    const isAuthor = user && collection.author && collection.author._id === user._id;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this collection?')) {
            return;
        }
        try {
            await deleteCollectionData(collection._id);
            toast.success('Collection deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete collection');
        }
    };

    const handleToggleStatus = async () => {
        try {
            await toggleCollectionStatusData(collection._id);
            toast.success(`Collection ${collection.isActive ? 'deactivated' : 'activated'} successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update collection status');
        }
    };

    const handleSetAsDefault = async () => {
        try {
            await setAsDefault(collection._id, collection.languageLevel);
            toast.success('Collection set as default successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to set as default');
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(collection);
        } else {
            setIsEditing(true);
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

    const difficultyColors = {
        'easy': 'bg-green-100 text-green-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'hard': 'bg-red-100 text-red-800'
    };

    const targetAudienceColors = {
        'general': 'bg-gray-100 text-gray-800',
        'beginners': 'bg-blue-100 text-blue-800',
        'students': 'bg-purple-100 text-purple-800',
        'professionals': 'bg-orange-100 text-orange-800',
        'children': 'bg-pink-100 text-pink-800'
    };

    return (
        <Card className={`w-full h-fit transition-all duration-200 hover:shadow-md ${!collection.isActive ? 'opacity-75' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Default indicator */}
                        {collection.isDefault && (
                            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full">
                                <Crown className="w-4 h-4" />
                            </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={collection.author?.profilePicture} alt={collection.author?.username} />
                                <AvatarFallback>
                                    {collection.author?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">{collection.author?.username}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(collection.createdAt).toLocaleDateString()}
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
                                        <DropdownMenuItem onClick={handleEdit}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleToggleStatus} disabled={loading}>
                                            {collection.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                            {collection.isActive ? 'Deactivate' : 'Activate'}
                                        </DropdownMenuItem>
                                        {!collection.isDefault && collection.isActive && (
                                            <DropdownMenuItem onClick={handleSetAsDefault} disabled={loading}>
                                                <Crown className="w-4 h-4 mr-2" />
                                                Set as Default
                                            </DropdownMenuItem>
                                        )}
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
                {/* Collection Title and Status */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Library className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">{collection.name}</h3>
                        {collection.isDefault && (
                            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Default
                            </Badge>
                        )}
                        {!collection.isActive && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                                Inactive
                            </Badge>
                        )}
                    </div>
                    {collection.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                    )}
                </div>

                {/* Language Level and Difficulty */}
                <div className="flex items-center justify-between">
                    <Badge className={languageLevelColors[collection.languageLevel] || 'bg-gray-100 text-gray-800'}>
                        {collection.languageLevel}
                    </Badge>
                    <Badge className={difficultyColors[collection.difficulty] || 'bg-gray-100 text-gray-800'}>
                        {collection.difficulty}
                    </Badge>
                </div>

                {/* Collection Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-700">
                            {collection.scenarios?.length || 0} scenarios
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">
                            {collection.formattedCompletionTime || 'Not specified'}
                        </span>
                    </div>
                </div>

                {/* Target Audience */}
                {collection.targetAudience && collection.targetAudience !== 'general' && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <Badge variant="outline" className={targetAudienceColors[collection.targetAudience] || 'bg-gray-100 text-gray-800'}>
                            {collection.targetAudience}
                        </Badge>
                    </div>
                )}

                {/* Tags */}
                {collection.tags && collection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {collection.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {collection.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{collection.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Version info */}
                <div className="text-center pt-2 border-t">
                    <p className="text-xs text-gray-500">
                        Version {collection.version} • Updated {new Date(collection.lastUpdated).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScenarioCollectionCard;