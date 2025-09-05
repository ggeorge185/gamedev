import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
    ArrowLeft, 
    Plus, 
    X, 
    Search, 
    Filter,
    Clock,
    Hash,
    Library,
    Save,
    Crown
} from 'lucide-react';
import { toast } from 'sonner';
import useScenarioAPI from '@/hooks/useScenarioAPI';
import useScenarioCollectionAPI from '@/hooks/useScenarioCollectionAPI';

const ScenarioCollectionForm = ({ collection = null, onClose, onSuccess }) => {
    const { user } = useSelector(store => store.auth);
    const { scenarios, loading: scenariosLoading } = useSelector(store => store.scenario);
    const { loading: collectionsLoading } = useSelector(store => store.scenarioCollection);
    
    const { getAllScenarios } = useScenarioAPI();
    const { createCollection, updateCollectionData } = useScenarioCollectionAPI();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        languageLevel: '',
        difficulty: 'medium',
        targetAudience: 'general',
        tags: [],
        scenarios: [],
        isActive: true,
        isDefault: false
    });
    
    const [selectedScenarios, setSelectedScenarios] = useState([]);
    const [availableScenarios, setAvailableScenarios] = useState([]);
    const [scenarioSearch, setScenarioSearch] = useState('');
    const [scenarioFilter, setScenarioFilter] = useState('');
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState({});

    const isEditing = !!collection;
    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const difficulties = ['easy', 'medium', 'hard'];
    const targetAudiences = ['general', 'beginners', 'students', 'professionals', 'children'];

    useEffect(() => {
        getAllScenarios();
    }, []);

    useEffect(() => {
        if (collection) {
            setFormData({
                name: collection.name || '',
                description: collection.description || '',
                languageLevel: collection.languageLevel || '',
                difficulty: collection.difficulty || 'medium',
                targetAudience: collection.targetAudience || 'general',
                tags: collection.tags || [],
                scenarios: collection.scenarios?.map(s => s._id || s) || [],
                isActive: collection.isActive !== undefined ? collection.isActive : true,
                isDefault: collection.isDefault || false
            });
            setSelectedScenarios(collection.scenarios || []);
        }
    }, [collection]);

    useEffect(() => {
        if (scenarios) {
            const filtered = scenarios.filter(scenario => {
                if (!formData.languageLevel) return true;
                return scenario.languageLevel === formData.languageLevel;
            });
            setAvailableScenarios(filtered);
        }
    }, [scenarios, formData.languageLevel]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
            handleInputChange('tags', [...formData.tags, newTag.trim().toLowerCase()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const handleScenarioToggle = (scenario) => {
        const scenarioId = scenario._id;
        const isSelected = selectedScenarios.some(s => (s._id || s) === scenarioId);
        
        if (isSelected) {
            setSelectedScenarios(prev => prev.filter(s => (s._id || s) !== scenarioId));
            handleInputChange('scenarios', formData.scenarios.filter(id => id !== scenarioId));
        } else {
            setSelectedScenarios(prev => [...prev, scenario]);
            handleInputChange('scenarios', [...formData.scenarios, scenarioId]);
        }
    };

    const getFilteredAvailableScenarios = () => {
        return availableScenarios.filter(scenario => {
            const matchesSearch = !scenarioSearch || 
                scenario.name.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
                scenario.story.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
                scenario.topic.toLowerCase().includes(scenarioSearch.toLowerCase());
            
            const matchesFilter = !scenarioFilter || 
                scenarioFilter === 'all' ||
                scenario.difficulty === scenarioFilter;
            
            return matchesSearch && matchesFilter;
        });
    };

    const calculateEstimatedTime = () => {
        return selectedScenarios.reduce((total, scenario) => {
            return total + (scenario.estimatedDuration || 0);
        }, 0);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Collection name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Collection name must be less than 100 characters';
        }
        
        if (!formData.languageLevel) {
            newErrors.languageLevel = 'Language level is required';
        }
        
        if (formData.scenarios.length === 0) {
            newErrors.scenarios = 'At least one scenario must be selected';
        }
        
        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
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
            const submissionData = {
                ...formData,
                author: user._id
            };
            
            if (isEditing) {
                await updateCollectionData(collection._id, submissionData);
                toast.success('Collection updated successfully');
            } else {
                await createCollection(submissionData);
                toast.success('Collection created successfully');
            }
            
            onSuccess();
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to save collection');
        }
    };

    const loading = scenariosLoading || collectionsLoading;

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Library className="w-6 h-6 text-blue-600" />
                                    {isEditing ? 'Edit Collection' : 'Create New Collection'}
                                </CardTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                    {isEditing ? 'Update your scenario collection' : 'Group scenarios by language level for easy access'}
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline">
                            <Hash className="w-3 h-3 mr-1" />
                            {selectedScenarios.length} scenarios
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle>Collection Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit}>
                            {/* Collection Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Collection Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter collection name..."
                                    className={errors.name ? 'border-red-500' : ''}
                                    maxLength={100}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe this collection..."
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                    maxLength={500}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                <p className="text-xs text-gray-500">{formData.description.length}/500 characters</p>
                            </div>

                            {/* Language Level */}
                            <div className="space-y-2">
                                <Label>Language Level *</Label>
                                <Select 
                                    value={formData.languageLevel} 
                                    onValueChange={(value) => handleInputChange('languageLevel', value)}
                                >
                                    <SelectTrigger className={errors.languageLevel ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select language level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languageLevels.map(level => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.languageLevel && <p className="text-sm text-red-500">{errors.languageLevel}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Difficulty */}
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select 
                                        value={formData.difficulty} 
                                        onValueChange={(value) => handleInputChange('difficulty', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {difficulties.map(difficulty => (
                                                <SelectItem key={difficulty} value={difficulty}>
                                                    {difficulty}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Target Audience */}
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select 
                                        value={formData.targetAudience} 
                                        onValueChange={(value) => handleInputChange('targetAudience', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetAudiences.map(audience => (
                                                <SelectItem key={audience} value={audience}>
                                                    {audience}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {formData.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Options */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                    />
                                    <Label htmlFor="isActive">Active Collection</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onCheckedChange={(checked) => handleInputChange('isDefault', checked)}
                                    />
                                    <Label htmlFor="isDefault" className="flex items-center gap-1">
                                        <Crown className="w-4 h-4 text-yellow-600" />
                                        Set as Default for {formData.languageLevel || 'this level'}
                                    </Label>
                                </div>
                            </div>

                            {/* Summary */}
                            {selectedScenarios.length > 0 && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium">{selectedScenarios.length} scenarios selected</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-purple-600" />
                                            <span>{calculateEstimatedTime()} minutes total</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    <Save className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Update Collection' : 'Create Collection'}
                                </Button>
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Right Column - Scenario Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Scenarios</CardTitle>
                        <p className="text-sm text-gray-600">Choose scenarios for this collection</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search and Filter */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search scenarios..."
                                    value={scenarioSearch}
                                    onChange={(e) => setScenarioSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
                                <SelectTrigger>
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Difficulties</SelectItem>
                                    {difficulties.map(difficulty => (
                                        <SelectItem key={difficulty} value={difficulty}>
                                            {difficulty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {errors.scenarios && <p className="text-sm text-red-500">{errors.scenarios}</p>}

                        {/* Available Scenarios */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {!formData.languageLevel ? (
                                <div className="text-center text-gray-500 py-8">
                                    <Hash className="w-8 h-8 mx-auto mb-2" />
                                    Please select a language level first
                                </div>
                            ) : getFilteredAvailableScenarios().length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <Hash className="w-8 h-8 mx-auto mb-2" />
                                    No scenarios found for {formData.languageLevel}
                                </div>
                            ) : (
                                getFilteredAvailableScenarios().map(scenario => {
                                    const isSelected = selectedScenarios.some(s => (s._id || s) === scenario._id);
                                    return (
                                        <div
                                            key={scenario._id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleScenarioToggle(scenario)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium text-sm">{scenario.name}</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            {scenario.difficulty}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                                        {scenario.story}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span>Topic: {scenario.topic}</span>
                                                        {scenario.estimatedDuration && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {scenario.estimatedDuration}min
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Checkbox checked={isSelected} />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ScenarioCollectionForm;