import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
    MoreHorizontal, 
    Trash2, 
    Edit, 
    BookOpen, 
    Globe, 
    MessageSquare,
    Tag,
    Star
} from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWord } from '@/redux/wordSlice';
import axios from 'axios';
import { toast } from 'sonner';

const WordCard = ({ word }) => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        germanWordSingular: word.germanWordSingular,
        germanWordPlural: word.germanWordPlural || '',
        article: word.article || '',
        englishTranslation: word.englishTranslation || '',
        englishDescription: word.englishDescription || '',
        jeopardyQuestion: word.jeopardyQuestion || ''
    });

    const isAuthor = user?._id === word.author._id;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this word?')) {
            return;
        }

        try {
            setLoading(true);
            const res = await axios.delete(`/api/v1/word/${word._id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(deleteWord(word._id));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete word');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        try {
            setLoading(true);
            const res = await axios.put(`/api/v1/word/${word._id}`, formData, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success('Word updated successfully');
                setIsEditing(false);
                // Reload page or refetch words if needed
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update word');
        } finally {
            setLoading(false);
        }
    };

    const levelColors = {
        'A1': 'bg-green-100 text-green-800',
        'A2': 'bg-green-200 text-green-900',
        'B1': 'bg-blue-100 text-blue-800',
        'B2': 'bg-blue-200 text-blue-900',
        'C1': 'bg-purple-100 text-purple-800',
        'C2': 'bg-purple-200 text-purple-900'
    };

    return (
        <>
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={word.author?.profilePicture} alt={word.author?.username} />
                            <AvatarFallback>
                                {word.author?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{word.author?.username}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(word.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    {isAuthor && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* German Word Section */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-600">{word.article}</span>
                        <h3 className="text-2xl font-bold text-gray-900">{word.germanWordSingular}</h3>
                    </div>
                    {word.germanWordPlural && (
                        <p className="text-lg text-gray-600">
                            Plural: <span className="font-medium">{word.germanWordPlural}</span>
                        </p>
                    )}
                </div>

                {/* Image */}
                {word.image && (
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                            src={word.image} 
                            alt={word.germanWordSingular}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Topic and Level */}
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {word.topic}
                    </Badge>
                    <Badge className={levelColors[word.languageLevel] || 'bg-gray-100 text-gray-800'}>
                        {word.languageLevel}
                    </Badge>
                </div>

                {/* English Translation */}
                {word.englishTranslation && (
                    <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">English:</p>
                            <p className="text-sm text-gray-600">{word.englishTranslation}</p>
                        </div>
                    </div>
                )}

                {/* English Description */}
                {word.englishDescription && (
                    <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Description:</p>
                            <p className="text-sm text-gray-600">{word.englishDescription}</p>
                        </div>
                    </div>
                )}

                {/* Jeopardy Question */}
                {word.jeopardyQuestion && (
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Jeopardy Question:</p>
                            <p className="text-sm text-gray-600">{word.jeopardyQuestion}</p>
                        </div>
                    </div>
                )}

                {/* Clues */}
                {word.clues && word.clues.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Clues:</p>
                        <div className="flex flex-wrap gap-1">
                            {word.clues.map((clue, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {clue}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Synonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Synonyms:</p>
                        <div className="flex flex-wrap gap-1">
                            {word.synonyms.map((synonym, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {synonym}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Further Characteristics */}
                {word.furtherCharacteristics && word.furtherCharacteristics.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Characteristics:</p>
                        <div className="flex flex-wrap gap-1">
                            {word.furtherCharacteristics.map((char, index) => (
                                <Badge key={index} variant="default" className="text-xs">
                                    <Star className="w-2 h-2 mr-1" />
                                    {char}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Edit Modal */}
        {isEditing && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg w-[400px]">
                    <h3 className="text-lg font-semibold mb-4">Edit Word</h3>
                    
                    <input
                        type="text"
                        value={formData.germanWordSingular}
                        onChange={(e) => setFormData({ ...formData, germanWordSingular: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="German Word"
                    />
                    
                    <input
                        type="text"
                        value={formData.germanWordPlural}
                        onChange={(e) => setFormData({ ...formData, germanWordPlural: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Plural"
                    />

                    <input
                        type="text"
                        value={formData.article}
                        onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Article (der/die/das)"
                    />

                    <input
                        type="text"
                        value={formData.englishTranslation}
                        onChange={(e) => setFormData({ ...formData, englishTranslation: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="English Translation"
                    />

                    <textarea
                        value={formData.englishDescription}
                        onChange={(e) => setFormData({ ...formData, englishDescription: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Description"
                    />

                    <textarea
                        value={formData.jeopardyQuestion}
                        onChange={(e) => setFormData({ ...formData, jeopardyQuestion: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Jeopardy Question"
                    />

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleEditSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default WordCard;
