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
    Target,
    Hash,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ScenarioForm = ({ scenario = null, onClose, onSuccess }) => {
    const isEditing = Boolean(scenario);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: 1,
        mapPosition: { x: 20, y: 30 },
        storyContext: '',
        availableLevels: ['A1', 'A2'],
        isRequired: true
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (scenario) {
            setFormData({
                name: scenario.name || '',
                description: scenario.description || '',
                order: scenario.order || 1,
                mapPosition: scenario.mapPosition || { x: 20, y: 30 },
                storyContext: scenario.storyContext || '',
                availableLevels: scenario.availableLevels || ['A1', 'A2'],
                isRequired: scenario.isRequired !== undefined ? scenario.isRequired : true
            });
        }
    }, [scenario]);

    const languageLevels = [
        { value: 'A1', label: 'A1 - Beginner' },
        { value: 'A2', label: 'A2 - Elementary' },
        { value: 'B1', label: 'B1 - Intermediate' },
        { value: 'B2', label: 'B2 - Upper Intermediate' },
        { value: 'C1', label: 'C1 - Advanced' },
        { value: 'C2', label: 'C2 - Proficient' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Scenario name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.storyContext.trim()) newErrors.storyContext = 'Story context is required';
        
        if (!formData.availableLevels || formData.availableLevels.length === 0) {
            newErrors.availableLevels = 'At least one level is required';
        }
        
        if (formData.order < 1) newErrors.order = 'Order must be at least 1';
        if (formData.order > 1000) newErrors.order = 'Order cannot exceed 1000';

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
                await axios.put(`/api/v1/game/admin/scenarios/${scenario._id}`, formData, {
                    withCredentials: true
                });
                toast.success('Scenario updated successfully');
            } else {
                await axios.post('/api/v1/game/admin/scenarios', formData, {
                    withCredentials: true
                });
                toast.success('Scenario created successfully');
            }
            
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} scenario`);
        } finally {
            setLoading(false);
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

    const handleMapPositionChange = (axis, value) => {
        setFormData(prev => ({
            ...prev,
            mapPosition: {
                ...prev.mapPosition,
                [axis]: parseInt(value) || 0
            }
        }));
    };

    const toggleLevel = (levelValue) => {
        setFormData(prev => ({
            ...prev,
            availableLevels: prev.availableLevels.includes(levelValue)
                ? prev.availableLevels.filter(l => l !== levelValue)
                : [...prev.availableLevels, levelValue].sort()
        }));
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    {isEditing ? 'Edit Scenario' : 'Create New Scenario'}
                </CardTitle>
                <p className="text-sm text-gray-600">
                    {isEditing ? 'Update your scenario settings' : 'Create a new learning scenario for language learners'}
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
                                    placeholder="e.g., Accommodation"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Brief description of the scenario..."
                                    rows={3}
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storyContext">Story Context *</Label>
                                <Textarea
                                    id="storyContext"
                                    value={formData.storyContext}
                                    onChange={(e) => handleInputChange('storyContext', e.target.value)}
                                    placeholder="Detailed context and story for learners..."
                                    rows={4}
                                />
                                {errors.storyContext && <p className="text-red-500 text-sm">{errors.storyContext}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Order Number *</Label>
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <Input
                                            id="order"
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={formData.order}
                                            onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                    {errors.order && <p className="text-red-500 text-sm">{errors.order}</p>}
                                    <p className="text-xs text-gray-500">Order in which this scenario appears</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Map Position</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs">X</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={formData.mapPosition.x}
                                                onChange={(e) => handleMapPositionChange('x', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Y</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={formData.mapPosition.y}
                                                onChange={(e) => handleMapPositionChange('y', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Position on the game map</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Levels */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            Available Levels
                        </h3>
                        
                        {errors.availableLevels && <p className="text-red-500 text-sm">{errors.availableLevels}</p>}
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {languageLevels.map(level => (
                                <div key={level.value} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`level-${level.value}`}
                                        checked={formData.availableLevels.includes(level.value)}
                                        onChange={() => toggleLevel(level.value)}
                                        className="rounded"
                                    />
                                    <Label htmlFor={`level-${level.value}`} className="text-sm">
                                        {level.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        
                        {formData.availableLevels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs text-gray-500">Selected: </span>
                                {formData.availableLevels.map(level => (
                                    <Badge key={level} variant="outline" className="text-xs">
                                        {level}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isRequired"
                                checked={formData.isRequired}
                                onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="isRequired">This scenario is required for progression</Label>
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