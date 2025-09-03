import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ScenarioCollectionCard from './ScenarioCollectionCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
    Search, 
    Filter, 
    Library, 
    Plus,
    Hash
} from 'lucide-react';
import useGetAllCollections from '@/hooks/useGetAllCollections';
import useGetUserCollections from '@/hooks/useGetUserCollections';

const ScenarioCollectionList = ({ type = 'user', showAddButton = false, onAddClick = null, onEditCollection = null }) => {
    const { collections, userCollections, loading } = useSelector(store => store.scenarioCollection);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');

    // Use appropriate hooks based on type
    useGetAllCollections();
    useGetUserCollections();

    // Get the appropriate collections array
    const getCollectionsArray = () => {
        switch (type) {
            case 'all': return collections;
            case 'user':
            default: return userCollections;
        }
    };

    const collectionsArray = getCollectionsArray();

    // Filter collections based on search and filters
    const filteredCollections = collectionsArray.filter(collection => {
        const matchesSearch = searchQuery === '' || 
            collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.languageLevel.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLevel = filterLevel === '' || filterLevel === 'all-levels' || collection.languageLevel === filterLevel;
        const matchesDifficulty = filterDifficulty === '' || filterDifficulty === 'all-difficulties' || collection.difficulty === filterDifficulty;

        return matchesSearch && matchesLevel && matchesDifficulty;
    });

    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const difficulties = ['easy', 'medium', 'hard'];

    const getTitle = () => {
        switch (type) {
            case 'all': return 'All Collections';
            case 'user':
            default: return 'My Collections';
        }
    };

    const getDescription = () => {
        switch (type) {
            case 'all': return 'Browse all scenario collections in the platform';
            case 'user':
            default: return 'Collections you have created and can manage';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading collections...</span>
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
                                <Library className="w-6 h-6 text-blue-600" />
                                {getTitle()}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{getDescription()}</p>
                        </div>
                        {showAddButton && (
                            <Button onClick={onAddClick}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Collection
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
                                placeholder="Search collections..."
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
                            <Library className="w-3 h-3" />
                            {filteredCollections.length} collections
                        </Badge>
                        {searchQuery && (
                            <span>Showing results for "{searchQuery}"</span>
                        )}
                        {(filterLevel && filterLevel !== 'all-levels' || 
                          filterDifficulty && filterDifficulty !== 'all-difficulties') && (
                            <span>Filtered by: {[
                                filterLevel && filterLevel !== 'all-levels' ? filterLevel : null,
                                filterDifficulty && filterDifficulty !== 'all-difficulties' ? filterDifficulty : null
                            ].filter(Boolean).join(', ')}</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Collections Grid */}
            {filteredCollections.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">
                            <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery || filterLevel || filterDifficulty
                                    ? 'Try adjusting your search or filters'
                                    : 'No collections are available at the moment'
                                }
                            </p>
                            {showAddButton && (
                                <Button onClick={onAddClick}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create your first collection
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCollections.map(collection => (
                        <ScenarioCollectionCard 
                            key={collection._id} 
                            collection={collection} 
                            showActions={type === 'user'}
                            onEdit={onEditCollection}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScenarioCollectionList;