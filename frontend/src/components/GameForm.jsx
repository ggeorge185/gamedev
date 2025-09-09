import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { 
    GamepadIcon, 
    Save, 
    X, 
    Settings,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const GameForm = ({ game = null, onClose, onSuccess }) => {
    const isEditing = Boolean(game);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        componentName: '',
        configOptions: {},
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Populate form with existing game data when editing
    useEffect(() => {
        if (game) {
            setFormData({
                name: game.name || '',
                description: game.description || '',
                componentName: game.componentName || '',
                configOptions: game.configOptions || {},
                isActive: game.isActive !== undefined ? game.isActive : true
            });
        }
    }, [game]);

    const gameTypes = [
        { value: 'MemoryGame', label: 'Memory Game' },
        { value: 'ScrabbleGame', label: 'Scrabble Game' },
        { value: 'QuizGame', label: 'Quiz Game' },
        { value: 'AnagramGame', label: 'Anagram Game' },
        { value: 'TabooGame', label: 'Taboo Game' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Game name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.componentName) newErrors.componentName = 'Game type is required';

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
            setLoading(true);
            if (isEditing) {
                await axios.put(`/api/v1/game/admin/game-types/${game._id}`, formData, {
                    withCredentials: true
                });
                toast.success('Game updated successfully');
            } else {
                await axios.post('/api/v1/game/admin/game-types', formData, {
                    withCredentials: true
                });
                toast.success('Game created successfully');
            }
            
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} game`);
        } finally {
            setLoading(false);
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

    const handleConfigChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            configOptions: {
                ...prev.configOptions,
                [key]: value
            }
        }));
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
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Game Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., Memory Challenge"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                        </div>
                    </div>

                    {/* Game Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-600" />
                            Game Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="componentName">Game Type *</Label>
                                <Select value={formData.componentName} onValueChange={(value) => handleInputChange('componentName', value)}>
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
                                {errors.componentName && <p className="text-red-500 text-sm">{errors.componentName}</p>}
                            </div>

                            {/* Basic Configuration Options */}
                            {formData.componentName && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900">Configuration Options</h4>
                                    
                                    {formData.componentName === 'MemoryGame' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Grid Size</Label>
                                                    <Input
                                                        value={formData.configOptions.gridSize || '4x4'}
                                                        onChange={(e) => handleConfigChange('gridSize', e.target.value)}
                                                        placeholder="4x4"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Time Limit (seconds)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.configOptions.timeLimit || 120}
                                                        onChange={(e) => handleConfigChange('timeLimit', parseInt(e.target.value))}
                                                        placeholder="120"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {formData.componentName === 'QuizGame' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Questions Count</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.configOptions.questionsCount || 10}
                                                        onChange={(e) => handleConfigChange('questionsCount', parseInt(e.target.value))}
                                                        placeholder="10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Time Per Question (seconds)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.configOptions.timePerQuestion || 30}
                                                        onChange={(e) => handleConfigChange('timePerQuestion', parseInt(e.target.value))}
                                                        placeholder="30"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {formData.componentName === 'AnagramGame' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Words Count</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.configOptions.wordsCount || 10}
                                                        onChange={(e) => handleConfigChange('wordsCount', parseInt(e.target.value))}
                                                        placeholder="10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Time Limit (seconds)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.configOptions.timeLimit || 180}
                                                        onChange={(e) => handleConfigChange('timeLimit', parseInt(e.target.value))}
                                                        placeholder="180"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
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