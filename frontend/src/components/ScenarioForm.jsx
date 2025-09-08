import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
    BookOpen, 
    Save, 
    X, 
    Clock,
    Target,
    Hash,
    Settings,
    Info,
    Gamepad2,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useScenarioAPI from '@/hooks/useScenarioAPI';
import useGetTopics from '@/hooks/useGetTopics';

const ScenarioForm = ({ scenario = null, onClose, onSuccess }) => {
    const { createScenario, updateScenarioData, loading } = useScenarioAPI();
    const { activeGames } = useSelector(state => state.game);
    const { topics, loading: topicsLoading } = useGetTopics();
    const isEditing = Boolean(scenario);

    const [formData, setFormData] = useState({
        name: '',
        story: '',
        topic: '',
        levels: [
            {
                languageLevel: 'A1',
                selectedGameId: '',
                estimatedDuration: 15
            }
        ],
        sequence: 1,
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (scenario) {
            setFormData({
                name: scenario.name || '',
                story: scenario.story || '',
                topic: scenario.topic || '',
                levels: scenario.levels && scenario.levels.length > 0 
                    ? scenario.levels.map(level => ({
                        languageLevel: level.languageLevel || 'A1',
                        selectedGameId: level.selectedGameId?._id || level.selectedGameId || '',
                        estimatedDuration: level.estimatedDuration || 15
                    }))
                    : [
                        {
                            languageLevel: 'A1',
                            selectedGameId: '',
                            estimatedDuration: 15
                        }
                    ],
                sequence: scenario.sequence || 1,
                isActive: scenario.isActive !== undefined ? scenario.isActive : true
            });
        }
    }, [scenario]);

    const languageLevels = [
        { value: 'A1', label: 'A1 - Beginner', color: 'bg-green-100 text-green-800' },
        { value: 'A2', label: 'A2 - Elementary', color: 'bg-green-200 text-green-900' },
        { value: 'B1', label: 'B1 - Intermediate', color: 'bg-blue-100 text-blue-800' },
        { value: 'B2', label: 'B2 - Upper Intermediate', color: 'bg-blue-200 text-blue-900' },
        { value: 'C1', label: 'C1 - Advanced', color: 'bg-purple-100 text-purple-800' },
        { value: 'C2', label: 'C2 - Proficient', color: 'bg-purple-200 text-purple-900' }
    ];



    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Scenario name is required';
        if (!formData.story.trim()) newErrors.story = 'Story/description is required';
        if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
        
        if (!formData.levels || formData.levels.length === 0) {
            newErrors.levels = 'At least one level is required';
        } else {
            // Validate each level
            const levelErrors = {};
            const usedLevels = new Set();
            
            formData.levels.forEach((level, index) => {
                const levelError = {};
                
                if (!level.selectedGameId) {
                    levelError.selectedGameId = 'Game selection is required';
                }
                
                if (level.estimatedDuration < 5) {
                    levelError.estimatedDuration = 'Duration must be at least 5 minutes';
                }
                if (level.estimatedDuration > 120) {
                    levelError.estimatedDuration = 'Duration cannot exceed 120 minutes';
                }
                
                // Check for duplicate levels
                if (usedLevels.has(level.languageLevel)) {
                    levelError.languageLevel = 'Duplicate language level';
                } else {
                    usedLevels.add(level.languageLevel);
                }
                
                if (Object.keys(levelError).length > 0) {
                    levelErrors[index] = levelError;
                }
            });
            
            if (Object.keys(levelErrors).length > 0) {
                newErrors.levelErrors = levelErrors;
            }
        }
        
        if (formData.sequence < 1) newErrors.sequence = 'Sequence must be at least 1';
        if (formData.sequence > 1000) newErrors.sequence = 'Sequence cannot exceed 1000';

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
                await updateScenarioData(scenario._id, formData);
                toast.success('Scenario updated successfully');
            } else {
                await createScenario(formData);
                toast.success('Scenario created successfully');
            }
            
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} scenario`);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    };

    const addLevel = () => {
        const usedLevels = formData.levels.map(level => level.languageLevel);
        const availableLevels = languageLevels.filter(level => !usedLevels.includes(level.value));
        
        if (availableLevels.length === 0) {
            return; // All levels are already used
        }

        const newLevel = {
            languageLevel: availableLevels[0].value,
            selectedGameId: '',
            estimatedDuration: 15
        };

        setFormData(prev => ({
            ...prev,
            levels: [...prev.levels, newLevel]
        }));
    };

    const removeLevel = (index) => {
        if (formData.levels.length > 1) {
            setFormData(prev => ({
                ...prev,
                levels: prev.levels.filter((_, i) => i !== index)
            }));
            
            // Clear level-specific errors
            if (errors.levelErrors && errors.levelErrors[index]) {
                const newLevelErrors = { ...errors.levelErrors };
                delete newLevelErrors[index];
                setErrors(prev => ({
                    ...prev,
                    levelErrors: newLevelErrors
                }));
            }
        }
    };

    const updateLevel = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.map((level, i) => 
                i === index ? { ...level, [field]: value } : level
            )
        }));
        
        // Clear level-specific errors
        if (errors.levelErrors && errors.levelErrors[index] && errors.levelErrors[index][field]) {
            const newLevelErrors = { ...errors.levelErrors };
            delete newLevelErrors[index][field];
            if (Object.keys(newLevelErrors[index]).length === 0) {
                delete newLevelErrors[index];
            }
            setErrors(prev => ({
                ...prev,
                levelErrors: newLevelErrors
            }));
        }
    };

    const getTotalDuration = () => {
        return formData.levels.reduce((total, level) => total + (level.estimatedDuration || 0), 0);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    {isEditing ? 'Edit Scenario' : 'Create New Scenario'}
                </CardTitle>
                <p className="text-sm text-gray-600">
                    {isEditing ? 'Update your scenario settings' : 'Create a new learning scenario that combines topics with games'}
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
                                <Label htmlFor="name">Scenario Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., Restaurant Conversation Challenge"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="story">Story/Description *</Label>
                                <Textarea
                                    id="story"
                                    value={formData.story}
                                    onChange={(e) => handleInputChange('story', e.target.value)}
                                    placeholder="Describe the scenario context and what learners will experience..."
                                    rows={4}
                                />
                                {errors.story && <p className="text-red-500 text-sm">{errors.story}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="topic">Topic *</Label>
                                    {topicsLoading ? (
                                        <div className="flex items-center gap-2 p-2 border rounded">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span className="text-sm text-gray-500">Loading topics...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Select value={formData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select topic" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {topics.length === 0 ? (
                                                        <SelectItem value="" disabled>No topics available</SelectItem>
                                                    ) : (
                                                        topics.map(topic => (
                                                            <SelectItem key={topic} value={topic}>
                                                                {topic}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500">
                                                Topics are loaded from existing words in the system
                                            </p>
                                        </>
                                    )}
                                    {errors.topic && <p className="text-red-500 text-sm">{errors.topic}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sequence">Sequence Number *</Label>
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <Input
                                            id="sequence"
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={formData.sequence}
                                            onChange={(e) => handleInputChange('sequence', parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                    {errors.sequence && <p className="text-red-500 text-sm">{errors.sequence}</p>}
                                    <p className="text-xs text-gray-500">Order in which this scenario appears</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Levels Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-600" />
                                Levels Configuration
                            </h3>
                            {formData.levels.length < languageLevels.length && (
                                <Button type="button" variant="outline" size="sm" onClick={addLevel}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Level
                                </Button>
                            )}
                        </div>

                        {errors.levels && <p className="text-red-500 text-sm">{errors.levels}</p>}
                        
                        <div className="space-y-6">
                            {formData.levels.map((level, index) => (
                                <Card key={index} className="border-2 border-gray-100">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-blue-600" />
                                                <h4 className="text-md font-semibold">
                                                    Level {index + 1}: {level.languageLevel}
                                                </h4>
                                                <Badge className={`${languageLevels.find(l => l.value === level.languageLevel)?.color}`}>
                                                    {languageLevels.find(l => l.value === level.languageLevel)?.label}
                                                </Badge>
                                            </div>
                                            {formData.levels.length > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => removeLevel(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Language Level *</Label>
                                                <Select 
                                                    value={level.languageLevel} 
                                                    onValueChange={(value) => updateLevel(index, 'languageLevel', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {languageLevels.filter(l => 
                                                            l.value === level.languageLevel || 
                                                            !formData.levels.some(existingLevel => existingLevel.languageLevel === l.value)
                                                        ).map(lvl => (
                                                            <SelectItem key={lvl.value} value={lvl.value}>
                                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${lvl.color}`}>
                                                                    {lvl.label}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.levelErrors?.[index]?.languageLevel && (
                                                    <p className="text-red-500 text-sm">{errors.levelErrors[index].languageLevel}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Duration (minutes) *</Label>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <Input
                                                        type="number"
                                                        min="5"
                                                        max="120"
                                                        value={level.estimatedDuration}
                                                        onChange={(e) => updateLevel(index, 'estimatedDuration', parseInt(e.target.value) || 5)}
                                                    />
                                                </div>
                                                {errors.levelErrors?.[index]?.estimatedDuration && (
                                                    <p className="text-red-500 text-sm">{errors.levelErrors[index].estimatedDuration}</p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    {formatDuration(level.estimatedDuration)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <Label>Game *</Label>
                                            <Select 
                                                value={level.selectedGameId} 
                                                onValueChange={(value) => updateLevel(index, 'selectedGameId', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select game" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {activeGames.map(game => (
                                                        <SelectItem key={game._id} value={game._id}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{game.displayName}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {game.gameType}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.levelErrors?.[index]?.selectedGameId && (
                                                <p className="text-red-500 text-sm">{errors.levelErrors[index].selectedGameId}</p>
                                            )}
                                            {level.selectedGameId && (
                                                <p className="text-xs text-gray-500">
                                                    {activeGames.find(g => g._id === level.selectedGameId)?.description}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Total Duration Summary */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold text-blue-900">Total Estimated Duration:</span>
                                    </div>
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                        {formatDuration(getTotalDuration())}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
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
                            <Label htmlFor="isActive">Scenario is active and available to learners</Label>
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
                            {loading ? 'Saving...' : (isEditing ? 'Update Scenario' : 'Create Scenario')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ScenarioForm;