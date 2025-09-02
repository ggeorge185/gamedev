import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    Hash,
    Save,
    RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import useScenarioAPI from '@/hooks/useScenarioAPI';
import useGetUserScenarios from '@/hooks/useGetUserScenarios';
import useGetTopics from '@/hooks/useGetTopics';

// Sortable wrapper for scenario cards
const SortableScenarioCard = ({ scenario, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: scenario._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ScenarioCard 
        scenario={scenario}
        showActions={true}
        isDragging={isDragging}
        dragHandleProps={listeners}
      />
    </div>
  );
};

const DraggableScenarioList = ({ showAddButton = false, onAddClick = null }) => {
    const { userScenarios, loading } = useSelector(store => store.scenario);
    const { reorderScenariosData } = useScenarioAPI();
    const { topics } = useGetTopics();
    const [scenarios, setScenarios] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTopic, setFilterTopic] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [activeId, setActiveId] = useState(null);

    // Use hook to get user scenarios
    useGetUserScenarios();

    // Update local scenarios when Redux state changes
    React.useEffect(() => {
        if (userScenarios && userScenarios.length > 0) {
            setScenarios([...userScenarios]);
            setHasChanges(false);
        }
    }, [userScenarios]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Filter scenarios based on search and filters
    const filteredScenarios = scenarios.filter(scenario => {
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

    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            setScenarios((items) => {
                const oldIndex = items.findIndex(item => item._id === active.id);
                const newIndex = items.findIndex(item => item._id === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                setHasChanges(true);
                return newItems;
            });
        }
    }

    const handleSaveOrder = async () => {
        try {
            // Create reorder data with new sequence numbers
            const reorderData = scenarios.map((scenario, index) => ({
                scenarioId: scenario._id,
                newSequence: index + 1
            }));

            await reorderScenariosData(reorderData);
            setHasChanges(false);
            toast.success('Scenario order updated successfully');
        } catch (error) {
            toast.error('Failed to save new order');
        }
    };

    const handleResetOrder = () => {
        setScenarios([...userScenarios]);
        setHasChanges(false);
        toast.info('Order reset to original');
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
                                My Scenarios
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">Drag and drop to reorder your scenarios</p>
                        </div>
                        <div className="flex gap-2">
                            {hasChanges && (
                                <>
                                    <Button variant="outline" onClick={handleResetOrder}>
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset
                                    </Button>
                                    <Button onClick={handleSaveOrder}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Order
                                    </Button>
                                </>
                            )}
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
                        {hasChanges && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Unsaved changes
                            </Badge>
                        )}
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
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={filteredScenarios.map(s => s._id)} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredScenarios.map((scenario) => (
                                <SortableScenarioCard 
                                    key={scenario._id} 
                                    scenario={scenario}
                                    isDragging={activeId === scenario._id}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};

export default DraggableScenarioList;