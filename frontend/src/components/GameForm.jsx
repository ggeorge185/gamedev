import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
    GamepadIcon, 
    Save, 
    X, 
    Clock,
    Users,
    Settings,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import useGameAPI from '@/hooks/useGameAPI';

const GameForm = ({ game = null, onClose, onSuccess }) => {
    const { createGame, updateGameData, loading } = useGameAPI();
    const isEditing = Boolean(game);

    const [formData, setFormData] = useState({
        name: '',
        displayName: '',
        description: '',
        minWords: 5,
        maxWords: 10,
        timeLimit: 300,
        instructions: '',
        gameType: '',
        difficulty: 'medium',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    // Populate form with existing game data when editing
    useEffect(() => {
        if (game) {
            setFormData({
                name: game.name || '',
                displayName: game.displayName || '',
                description: game.description || '',
                minWords: game.minWords || 5,
                maxWords: game.maxWords || 10,
                timeLimit: game.timeLimit || 300,
                instructions: game.instructions || '',
                gameType: game.gameType || '',
                difficulty: game.difficulty || 'medium',
                isActive: game.isActive !== undefined ? game.isActive : true
            });
        }
    }, [game]);

    const gameTypes = [
        { value: 'word-puzzle', label: 'Word Puzzle' },
        { value: 'matching', label: 'Matching' },
        { value: 'quiz', label: 'Quiz' },
        { value: 'memory', label: 'Memory' },
        { value: 'drag-drop', label: 'Drag & Drop' },
        { value: 'typing', label: 'Typing' },
        { value: 'pronunciation', label: 'Pronunciation' }
    ];

    const difficulties = [
        { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Game name is required';
        if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
        if (!formData.gameType) newErrors.gameType = 'Game type is required';
        
        if (formData.minWords < 1) newErrors.minWords = 'Minimum words must be at least 1';
        if (formData.maxWords < 1) newErrors.maxWords = 'Maximum words must be at least 1';
        if (formData.minWords > formData.maxWords) {
            newErrors.minWords = 'Minimum words cannot be greater than maximum words';
        }
        
        if (formData.timeLimit < 30) newErrors.timeLimit = 'Time limit must be at least 30 seconds';
        if (formData.timeLimit > 1800) newErrors.timeLimit = 'Time limit cannot exceed 30 minutes';

        // Validate game name format (only for new games or when name changes)
        if (!isEditing || formData.name !== game.name) {
            if (!/^[a-z0-9-_]+$/.test(formData.name)) {
                newErrors.name = 'Game name can only contain lowercase letters, numbers, hyphens, and underscores';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        try {
            if (isEditing) {
                await updateGameData(game._id, formData);
                toast.success('Game updated successfully');
            } else {
                await createGame(formData);
                toast.success('Game created successfully');
            }
            
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} game`);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const formatTimeLimit = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GamepadIcon className="w-6 h-6 text-blue-600" />
                    {isEditing ? 'Edit Game' : 'Create New Game'}
                </CardTitle>
                <p className="text-sm text-gray-600">
                    {isEditing ? 'Update your game settings' : 'Create a new learning game for vocabulary practice'}
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Game Name (ID) *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value.toLowerCase())}
                                    placeholder="e.g., word-match-game"
                                    disabled={isEditing} // Don't allow name changes when editing
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                <p className="text-xs text-gray-500">Unique identifier (lowercase, no spaces)</p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name *</Label>
                                <Input
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                    placeholder="e.g., Word Matching Challenge"
                                />
                                {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Describe what this game does and how it helps with learning..."
                                rows={3}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructions">Instructions *</Label>
                            <Textarea
                                id="instructions"
                                value={formData.instructions}
                                onChange={(e) => handleInputChange('instructions', e.target.value)}
                                placeholder="Provide clear instructions for players on how to play this game..."
                                rows={4}
                            />
                            {errors.instructions && <p className="text-red-500 text-sm">{errors.instructions}</p>}
                        </div>
                    </div>

                    {/* Game Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-600" />
                            Game Settings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gameType">Game Type *</Label>
                                <Select value={formData.gameType} onValueChange={(value) => handleInputChange('gameType', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select game type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gameTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.gameType && <p className="text-red-500 text-sm">{errors.gameType}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {difficulties.map(diff => (
                                            <SelectItem key={diff.value} value={diff.value}>
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${diff.color}`}>
                                                    {diff.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Word and Time Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Word & Time Settings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minWords">Minimum Words</Label>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <Input
                                        id="minWords"
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={formData.minWords}
                                        onChange={(e) => handleInputChange('minWords', parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                {errors.minWords && <p className="text-red-500 text-sm">{errors.minWords}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxWords">Maximum Words</Label>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <Input
                                        id="maxWords"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.maxWords}
                                        onChange={(e) => handleInputChange('maxWords', parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                {errors.maxWords && <p className="text-red-500 text-sm">{errors.maxWords}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <Input
                                        id="timeLimit"
                                        type="number"
                                        min="30"
                                        max="1800"
                                        value={formData.timeLimit}
                                        onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 30)}
                                    />
                                </div>
                                {errors.timeLimit && <p className="text-red-500 text-sm">{errors.timeLimit}</p>}
                                <p className="text-xs text-gray-500">
                                    {formatTimeLimit(formData.timeLimit)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="isActive">Game is active and available to players</Label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        {onClose && (
                            <Button type="button" variant="outline" onClick={onClose}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : (isEditing ? 'Update Game' : 'Create Game')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default GameForm;