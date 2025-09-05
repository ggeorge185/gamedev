import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserWords } from '@/redux/wordSlice';
import WordCard from './WordCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AddWordForm from './AddWordForm';

const MyWords = () => {
    const { userWords } = useSelector(store => store.word);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [topicFilter, setTopicFilter] = useState('');
    const [filteredWords, setFilteredWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchUserWords();
    }, []);

    useEffect(() => {
        filterWords();
    }, [userWords, searchQuery, levelFilter, topicFilter]);

    const fetchUserWords = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/word/user', {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUserWords(res.data.words));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch your words');
        } finally {
            setLoading(false);
        }
    };

    const filterWords = () => {
        let filtered = userWords;

        if (searchQuery) {
            filtered = filtered.filter(word => 
                word.germanWordSingular.toLowerCase().includes(searchQuery.toLowerCase()) ||
                word.germanWordPlural.toLowerCase().includes(searchQuery.toLowerCase()) ||
                word.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                word.topic.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (levelFilter && levelFilter !== "all") {
            filtered = filtered.filter(word => word.languageLevel === levelFilter);
        }
        if (topicFilter && topicFilter !== "all") {
            filtered = filtered.filter(word => word.topic.toLowerCase().includes(topicFilter.toLowerCase()));
        }

        setFilteredWords(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLevelFilter('');
        setTopicFilter('');
    };

    // Get unique topics for filter dropdown
    const topics = [...new Set(userWords.map(word => word.topic))];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg">Loading your words...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My German Words</h1>
                    <p className="text-gray-600">Manage your personal German vocabulary collection</p>
                </div>
                <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Word
                </Button>
            </div>

            {/* Filters Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search your words..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Level Filter */}
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by level" />
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

                    {/* Topic Filter */}
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by topic" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Topics</SelectItem>
                            {topics.map(topic => (
                                <SelectItem key={topic} value={topic}>
                                    {topic}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="w-full md:w-auto"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    Showing {filteredWords.length} of {userWords.length} words
                </div>
            </div>

            {/* Words Grid */}
            {filteredWords.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-2">
                        {userWords.length === 0 ? 'No words in your collection yet' : 'No words match your filters'}
                    </div>
                    <div className="text-gray-400 mb-4">
                        {userWords.length === 0 
                            ? 'Start building your German vocabulary by adding your first word!' 
                            : 'Try adjusting your search criteria'
                        }
                    </div>
                    {userWords.length === 0 && (
                        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Your First Word
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWords.map(word => (
                        <WordCard key={word._id} word={word} />
                    ))}
                </div>
            )}

            <AddWordForm open={open} setOpen={setOpen} />
        </div>
    );
};

export default MyWords;
