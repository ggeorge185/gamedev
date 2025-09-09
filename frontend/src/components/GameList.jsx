import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
    Search, 
    Filter, 
    GamepadIcon, 
    Plus,
    Settings
} from 'lucide-react';
import axios from 'axios';

const GameList = ({ type = 'active', showAddButton = false }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        loadGames();
    }, [type]);

    const loadGames = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/game/game-types');
            if (res.data.success) {
                let gamesData = res.data.gameTypes;
                
                // Filter based on type
                if (type === 'active') {
                    gamesData = gamesData.filter(game => game.isActive);
                }
                
                setGames(gamesData);
            }
        } catch (error) {
            console.error('Error loading games:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter games based on search and filters
    const filteredGames = games.filter(game => {
        const matchesSearch = searchQuery === '' || 
            game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (game.componentName || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = filterType === '' || filterType === 'all-types' || game.componentName === filterType;

        return matchesSearch && matchesType;
    });

    const gameTypes = [...new Set(games.map(game => game.componentName).filter(Boolean))];

    const getTitle = () => {
        switch (type) {
            case 'all': return 'All Games';
            case 'user': return 'My Games';
            case 'active':
            default: return 'Available Games';
        }
    };

    const getDescription = () => {
        switch (type) {
            case 'all': return 'Browse all games in the platform';
            case 'user': return 'Games you have created';
            case 'active':
            default: return 'Active games ready to play';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading games...</span>
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
                                <GamepadIcon className="w-6 h-6 text-blue-600" />
                                {getTitle()}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{getDescription()}</p>
                        </div>
                        {showAddButton && (
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Game
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
                                placeholder="Search games..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <Settings className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Game Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-types">All Types</SelectItem>
                                    {gameTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <GamepadIcon className="w-3 h-3" />
                            {filteredGames.length} games
                        </Badge>
                        {searchQuery && (
                            <span>Showing results for "{searchQuery}"</span>
                        )}
                        {(filterType && filterType !== 'all-types') && (
                            <span>Filtered by: {filterType}</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Games Grid */}
            {filteredGames.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">
                            <GamepadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery || filterType
                                    ? 'Try adjusting your search or filters'
                                    : 'No games are available at the moment'
                                }
                            </p>
                            {showAddButton && (
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create your first game
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredGames.map(game => (
                        <GameCard 
                            key={game._id} 
                            game={game} 
                            showActions={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameList;