import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setWords } from '@/redux/wordSlice';
import WordCard from './WordCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const SearchPage = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim() && (!levelFilter || levelFilter === "all") && (!topicFilter || topicFilter === "all")) {
            toast.error('Please enter search criteria');
            return;
        }

        try {
            setLoading(true);
            const params = new URLSearchParams();
        
            if (searchQuery.trim()) params.append('query', searchQuery.trim());
            if (levelFilter && levelFilter !== "all") params.append('level', levelFilter);
            if (topicFilter && topicFilter !== "all") params.append('topic', topicFilter);

            const res = await axios.get(`/api/v1/word/search?${params.toString()}`, {
                withCredentials: true
            });

            if (res.data.success) {
                setSearchResults(res.data.words);
                setHasSearched(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setLevelFilter('');
        setTopicFilter('');
        setSearchResults([]);
        setHasSearched(false);
    };

    return (
        <div className='max-w-6xl mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-6'>Search German Words</h1>
            
            {/* Search Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Term
                        </label>
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="German word, English translation, topic..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language Level
                        </label>
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="A1">A1</SelectItem>
                                <SelectItem value="A2">A2</SelectItem>
                                <SelectItem value="B1">B1</SelectItem>
                                <SelectItem value="B2">B2</SelectItem>
                                <SelectItem value="C1">C1</SelectItem>
                                <SelectItem value="C2">C2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Topic
                        </label>
                        <Input
                            value={topicFilter}
                            onChange={(e) => setTopicFilter(e.target.value)}
                            placeholder="e.g., Food, Travel, Home"
                        />
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                    <Button variant="outline" onClick={clearSearch}>
                        Clear
                    </Button>
                </div>
            </div>

            {/* Search Results */}
            {hasSearched && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Search Results ({searchResults.length} found)
                        </h2>
                    </div>
                    
                    {searchResults.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">No words found</div>
                            <div className="text-gray-400">Try different search criteria</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map(word => (
                                <WordCard key={word._id} word={word} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;



