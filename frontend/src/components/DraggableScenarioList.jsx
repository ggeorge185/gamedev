import React, { useState, useEffect } from 'react';
import ScenarioCard from './ScenarioCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
    Search, 
    Filter, 
    BookOpen, 
    Plus,
    Target,
    Hash
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const DraggableScenarioList = ({ showAddButton = false, onAddClick = null }) => {
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLevel, setFilterLevel] = useState('');

    useEffect(() => {
        loadScenarios();
    }, []);

    const loadScenarios = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/game/scenarios');
            if (res.data.success) {
                // For "My Scenarios", we'll show all scenarios
                // In a real app, this would filter by current user
                setScenarios(res.data.scenarios);
            }
        } catch (error) {
            console.error('Error loading scenarios:', error);
            toast.error('Failed to load scenarios');
        } finally {
            setLoading(false);
        }
    };

    // Filter scenarios based on search and filters
    const filteredScenarios = scenarios.filter(scenario => {
        const matchesSearch = searchQuery === '' || 
            scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (scenario.storyContext || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLevel = filterLevel === '' || filterLevel === 'all-levels' || 
            (scenario.availableLevels && scenario.availableLevels.includes(filterLevel));

        return matchesSearch && matchesLevel;
    });

    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading scenarios...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                My Scenarios
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">Manage and organize your scenarios</p>
                        </div>
                        <div className="flex gap-2">
                            {showAddButton && (
                                <Button onClick={onAddClick}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Scenario
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search scenarios..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={filterLevel} onValueChange={setFilterLevel}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <Hash className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-levels">All Levels</SelectItem>
                                    {languageLevels.map(level => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {filteredScenarios.length} scenarios
                        </Badge>
                        {searchQuery && (
                            <span>Showing results for "{searchQuery}"</span>
                        )}
                        {(filterLevel && filterLevel !== 'all-levels') && (
                            <span>Filtered by level: {filterLevel}</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Scenarios Grid */}
            {filteredScenarios.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery || filterLevel
                                    ? 'Try adjusting your search or filters'
                                    : 'No scenarios are available at the moment'
                                }
                            </p>
                            {showAddButton && (
                                <Button onClick={onAddClick}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create your first scenario
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredScenarios.map((scenario) => (
                        <ScenarioCard 
                            key={scenario._id} 
                            scenario={scenario}
                            showActions={true}
                            isDragging={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DraggableScenarioList;