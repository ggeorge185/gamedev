import React, { useState, useRef } from 'react';
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
    Star,
    X
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

    // For editing all fields
    const [formData, setFormData] = useState({
        germanWordSingular: word.germanWordSingular,
        germanWordPlural: word.germanWordPlural || '',
        article: word.article || '',
        englishTranslation: word.englishTranslation || '',
        englishDescription: word.englishDescription || '',
        jeopardyQuestion: word.jeopardyQuestion || '',
        topic: word.topic || '',
        languageLevel: word.languageLevel || '',
        clues: Array.isArray(word.clues) ? word.clues : [],
        synonyms: Array.isArray(word.synonyms) ? word.synonyms : [],
        furtherCharacteristics: Array.isArray(word.furtherCharacteristics) ? word.furtherCharacteristics : [],
    });

    // For image upload
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(word.image || "");
    const [removeImage, setRemoveImage] = useState(false);
    const imageRef = useRef();

    // For editing array fields
    const [newClue, setNewClue] = useState('');
    const [newSynonym, setNewSynonym] = useState('');
    const [newCharacteristic, setNewCharacteristic] = useState('');

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

    // Image handlers
    const handleImageChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(selectedFile);
            setRemoveImage(false);
        }
    };
    const handleRemoveImage = () => {
        setImagePreview("");
        setFile(null);
        setRemoveImage(true);
    };

    // Array field handlers
    const addToArray = (field, value, setter) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    };
    const removeFromArray = (field, idx) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== idx)
        }));
    };

    const handleEditSave = async () => {
        try {
            setLoading(true);
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    data.append(key, JSON.stringify(value));
                } else {
                    data.append(key, value);
                }
            });
            if (file) data.append('image', file);
            if (removeImage) data.append('removeImage', 'true');

            const res = await axios.put(`/api/v1/word/${word._id}`, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success('Word updated successfully');
                setIsEditing(false);
                window.location.reload(); // Or refresh data in parent
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
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
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
                {word.image && (
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                            src={word.image} 
                            alt={word.germanWordSingular}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {word.topic}
                    </Badge>
                    <Badge className={levelColors[word.languageLevel] || 'bg-gray-100 text-gray-800'}>
                        {word.languageLevel}
                    </Badge>
                </div>
                {word.englishTranslation && (
                    <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">English:</p>
                            <p className="text-sm text-gray-600">{word.englishTranslation}</p>
                        </div>
                    </div>
                )}
                {word.englishDescription && (
                    <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Description:</p>
                            <p className="text-sm text-gray-600">{word.englishDescription}</p>
                        </div>
                    </div>
                )}
                {word.jeopardyQuestion && (
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-1 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Jeopardy Question:</p>
                            <p className="text-sm text-gray-600">{word.jeopardyQuestion}</p>
                        </div>
                    </div>
                )}
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
                <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Edit Word</h3>

                    {/* Image Upload */}
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={handleRemoveImage}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="text-center cursor-pointer"
                                    onClick={() => imageRef.current.click()}
                                >
                                    <p className="text-gray-500">Click to upload image</p>
                                </div>
                            )}
                            <input
                                ref={imageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* All word fields, now with field names */}
                    <label className="block text-sm font-medium mb-1">German Word</label>
                    <input
                        type="text"
                        value={formData.germanWordSingular}
                        onChange={(e) => setFormData({ ...formData, germanWordSingular: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="German Word"
                    />

                    <label className="block text-sm font-medium mb-1">Plural</label>
                    <input
                        type="text"
                        value={formData.germanWordPlural}
                        onChange={(e) => setFormData({ ...formData, germanWordPlural: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Plural"
                    />

                    <label className="block text-sm font-medium mb-1">Article (der/die/das)</label>
                    <input
                        type="text"
                        value={formData.article}
                        onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Article (der/die/das)"
                    />

                    <label className="block text-sm font-medium mb-1">Topic</label>
                    <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Topic"
                    />

                    <label className="block text-sm font-medium mb-1">Language Level (A1, B2, etc)</label>
                    <input
                        type="text"
                        value={formData.languageLevel}
                        onChange={(e) => setFormData({ ...formData, languageLevel: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Language Level (A1, B2, etc)"
                    />

                    <label className="block text-sm font-medium mb-1">English Translation</label>
                    <input
                        type="text"
                        value={formData.englishTranslation}
                        onChange={(e) => setFormData({ ...formData, englishTranslation: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="English Translation"
                    />

                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={formData.englishDescription}
                        onChange={(e) => setFormData({ ...formData, englishDescription: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Description"
                    />

                    <label className="block text-sm font-medium mb-1">Jeopardy Question</label>
                    <textarea
                        value={formData.jeopardyQuestion}
                        onChange={(e) => setFormData({ ...formData, jeopardyQuestion: e.target.value })}
                        className="border p-2 w-full mb-3"
                        placeholder="Jeopardy Question"
                    />

                    {/* Clues Array Editor */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Clues</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.clues.map((clue, idx) => (
                                <span key={idx} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                    {clue}
                                    <button type="button" className="ml-1 text-red-500" onClick={() => removeFromArray('clues', idx)}><X className="w-3 h-3 inline" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newClue}
                                onChange={e => setNewClue(e.target.value)}
                                className="border p-1 flex-1 text-xs"
                                placeholder="Add clue"
                            />
                            <Button type="button" size="sm" onClick={() => addToArray('clues', newClue, setNewClue)}>Add</Button>
                        </div>
                    </div>
                    {/* Synonyms Array Editor */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Synonyms</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.synonyms.map((synonym, idx) => (
                                <span key={idx} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                    {synonym}
                                    <button type="button" className="ml-1 text-red-500" onClick={() => removeFromArray('synonyms', idx)}><X className="w-3 h-3 inline" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSynonym}
                                onChange={e => setNewSynonym(e.target.value)}
                                className="border p-1 flex-1 text-xs"
                                placeholder="Add synonym"
                            />
                            <Button type="button" size="sm" onClick={() => addToArray('synonyms', newSynonym, setNewSynonym)}>Add</Button>
                        </div>
                    </div>
                    {/* Further Characteristics Array Editor */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Characteristics</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.furtherCharacteristics.map((char, idx) => (
                                <span key={idx} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                    {char}
                                    <button type="button" className="ml-1 text-red-500" onClick={() => removeFromArray('furtherCharacteristics', idx)}><X className="w-3 h-3 inline" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCharacteristic}
                                onChange={e => setNewCharacteristic(e.target.value)}
                                className="border p-1 flex-1 text-xs"
                                placeholder="Add characteristic"
                            />
                            <Button type="button" size="sm" onClick={() => addToArray('furtherCharacteristics', newCharacteristic, setNewCharacteristic)}>Add</Button>
                        </div>
                    </div>
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
