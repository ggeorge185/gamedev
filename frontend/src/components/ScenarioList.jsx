import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
    Clock,
    Settings,
    Hash
} from 'lucide-react';
import useGetActiveScenarios from '@/hooks/useGetActiveScenarios';
import useGetAllScenarios from '@/hooks/useGetAllScenarios';
import useGetUserScenarios from '@/hooks/useGetUserScenarios';
import useGetTopics from '@/hooks/useGetTopics';

const ScenarioList = ({ type = 'active', showAddButton = false, onAddClick = null, enableDragDrop = false }) => {
    const { scenarios, activeScenarios, userScenarios, loading } = useSelector(store => store.scenario);
    const { topics } = useGetTopics();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTopic, setFilterTopic] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');

    // Use appropriate hooks based on type
    useGetActiveScenarios();
    useGetAllScenarios();
    useGetUserScenarios();

    // Get the appropriate scenarios array
    const getScenariosArray = () => {
        switch (type) {
            case 'all': return scenarios;
            case 'user': return userScenarios;
            case 'active':
            default: return activeScenarios;
        }
    };

    const scenariosArray = getScenariosArray();

    // Filter scenarios based on search and filters
    const filteredScenarios = scenariosArray.filter(scenario => {
        const matchesSearch = searchQuery === '' || 
            scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scenario.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (scenario.selectedGameId?.displayName || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTopic = filterTopic === '' || filterTopic === 'all-topics' || scenario.topic === filterTopic;
        const matchesLevel = filterLevel === '' || filterLevel === 'all-levels' || scenario.languageLevel === filterLevel;
        const matchesDifficulty = filterDifficulty === '' || filterDifficulty === 'all-difficulties' || scenario.difficulty === filterDifficulty;

        return matchesSearch && matchesTopic && matchesLevel && matchesDifficulty;
    });


    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const difficulties = ['easy', 'medium', 'hard'];

    const getTitle = () => {
        switch (type) {
            case 'all': return 'All Scenarios';
            case 'user': return 'My Scenarios';
            case 'active':
            default: return 'Available Scenarios';
        }
    };

    const getDescription = () => {
        switch (type) {
            case 'all': return 'Browse all learning scenarios in the platform';
            case 'user': return 'Scenarios you have created and can manage';
            case 'active':
            default: return 'Active scenarios ready for learning';
        }
    };

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
                                {getTitle()}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{getDescription()}</p>
                        </div>
                        {showAddButton && (
                            <Button onClick={onAddClick}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Scenario
                            </Button>
                        )}
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
                            <Select value={filterTopic} onValueChange={setFilterTopic}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <Target className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-topics">All Topics</SelectItem>
                                    {topics.map(topic => (
                                        <SelectItem key={topic} value={topic}>
                                            {topic}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-difficulties">All Difficulties</SelectItem>
                                    {difficulties.map(difficulty => (
                                        <SelectItem key={difficulty} value={difficulty}>
                                            {difficulty}
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
                        {(filterTopic && filterTopic !== 'all-topics' || 
                          filterLevel && filterLevel !== 'all-levels' || 
                          filterDifficulty && filterDifficulty !== 'all-difficulties') && (
                            <span>Filtered by: {[
                                filterTopic && filterTopic !== 'all-topics' ? filterTopic : null,
                                filterLevel && filterLevel !== 'all-levels' ? filterLevel : null,
                                filterDifficulty && filterDifficulty !== 'all-difficulties' ? filterDifficulty : null
                            ].filter(Boolean).join(', ')}</span>
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
                                {searchQuery || filterTopic || filterLevel || filterDifficulty
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
                    {filteredScenarios.map((scenario, index) => (
                        <ScenarioCard 
                            key={scenario._id} 
                            scenario={scenario} 
                            showActions={true}
                            isDragging={false}
                            dragHandleProps={enableDragDrop ? {} : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScenarioList;