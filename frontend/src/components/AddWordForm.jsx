import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addWord } from '@/redux/wordSlice';
import { readFileAsDataURL } from '@/lib/utils';

const topicOptions = [
  "accommodation",
  "university related",
  "city registration",
  "transportation",
  "add-category"
];

const AddWordForm = ({ open, setOpen }) => {
  const imageRef = useRef();
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    germanWordSingular: '',
    germanWordPlural: '',
    article: '',
    topic: '',
    languageLevel: 'A1',
    englishTranslation: '',
    englishDescription: '',
    jeopardyQuestion: '',
    clues: [],
    synonyms: [],
    furtherCharacteristics: []
  });

  const [file, setFile] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);

  const [newClue, setNewClue] = useState('');
  const [newSynonym, setNewSynonym] = useState('');
  const [newCharacteristic, setNewCharacteristic] = useState('');

  const [showCustomTopic, setShowCustomTopic] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setImagePreview(dataUrl);
    }
  };

  const addToArray = (arrayField, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayField]: [...prev[arrayField], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (arrayField, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.germanWordSingular || !formData.article || !formData.topic) {
      toast.error('German word, article, and topic are required');
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('germanWordSingular', formData.germanWordSingular);
      submitData.append('germanWordPlural', formData.germanWordPlural);
      submitData.append('article', formData.article);
      submitData.append('topic', formData.topic);
      submitData.append('languageLevel', formData.languageLevel);
      submitData.append('englishTranslation', formData.englishTranslation);
      submitData.append('englishDescription', formData.englishDescription);
      submitData.append('jeopardyQuestion', formData.jeopardyQuestion);
      submitData.append('clues', JSON.stringify(formData.clues));
      submitData.append('synonyms', JSON.stringify(formData.synonyms));
      submitData.append('furtherCharacteristics', JSON.stringify(formData.furtherCharacteristics));

      if (file) {
        submitData.append('image', file);
      }

      const res = await axios.post('/api/v1/word/add', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(addWord(res.data.word));
        toast.success(res.data.message);
        setOpen(false);

        setFormData({
          germanWordSingular: '',
          germanWordPlural: '',
          article: '',
          topic: '',
          languageLevel: 'A1',
          englishTranslation: '',
          englishDescription: '',
          jeopardyQuestion: '',
          clues: [],
          synonyms: [],
          furtherCharacteristics: []
        });
        setFile('');
        setImagePreview('');
        setShowCustomTopic(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add word');
    } finally {
      setLoading(false);
    }
  };

  const handleJSONUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      toast.error('Only JSON files are supported');
      return;
    }
    setBulkUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/v1/word/bulk-upload-json', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success(`${res.data.count} words uploaded successfully!`);
        setOpen(false);
      } else {
        toast.error(res.data.message || 'Bulk upload failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk upload error');
    } finally {
      setBulkUploading(false);
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="text-center font-semibold">Add New German Word</DialogHeader>
        
        <div className="my-4">
          <label htmlFor="json-upload" className="block text-sm mb-1">Bulk Upload (JSON):</label>
          <input
            id="json-upload"
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleJSONUpload}
            disabled={bulkUploading}
          />
          <small className="text-gray-500 block mt-1">
            Download a <a href="/example.json" className="underline">JSON template</a>.
          </small>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="germanWordSingular">German Word (Singular) *</Label>
              <Input
                id="germanWordSingular"
                value={formData.germanWordSingular}
                onChange={(e) => handleInputChange('germanWordSingular', e.target.value)}
                placeholder="e.g., Haus"
                required
              />
            </div>

            <div>
              <Label htmlFor="germanWordPlural">German Word (Plural)</Label>
              <Input
                id="germanWordPlural"
                value={formData.germanWordPlural}
                onChange={(e) => handleInputChange('germanWordPlural', e.target.value)}
                placeholder="e.g., Häuser"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="article">Article *</Label>
              <Select
                value={formData.article}
                onValueChange={(value) => handleInputChange('article', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select article" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="der">der</SelectItem>
                  <SelectItem value="die">die</SelectItem>
                  <SelectItem value="das">das</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Select
                value={showCustomTopic ? "add-category" : formData.topic}
                onValueChange={(value) => {
                  if (value === "add-category") {
                    setShowCustomTopic(true);
                    handleInputChange('topic', '');
                  } else {
                    setShowCustomTopic(false);
                    handleInputChange('topic', value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topicOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === "add-category"
                        ? "Add category"
                        : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showCustomTopic && (
                <Input
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="Enter custom topic"
                  required
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="languageLevel">Language Level</Label>
            <Select
              value={formData.languageLevel}
              onValueChange={(value) => handleInputChange('languageLevel', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <Label>Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setFile('');
                    }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="englishTranslation">English Translation</Label>
              <Input
                id="englishTranslation"
                value={formData.englishTranslation}
                onChange={(e) => handleInputChange('englishTranslation', e.target.value)}
                placeholder="e.g., house"
              />
            </div>

            <div>
              <Label htmlFor="jeopardyQuestion">Jeopardy Question</Label>
              <Input
                id="jeopardyQuestion"
                value={formData.jeopardyQuestion}
                onChange={(e) => handleInputChange('jeopardyQuestion', e.target.value)}
                placeholder="Question that prompts this word"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="englishDescription">English Description</Label>
            <Textarea
              id="englishDescription"
              value={formData.englishDescription}
              onChange={(e) => handleInputChange('englishDescription', e.target.value)}
              placeholder="Detailed description in English"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Clues</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newClue}
                  onChange={(e) => setNewClue(e.target.value)}
                  placeholder="Add a clue"
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), addToArray('clues', newClue, setNewClue))
                  }
                />
                <Button
                  type="button"
                  onClick={() => addToArray('clues', newClue, setNewClue)}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.clues.map((clue, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {clue}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFromArray('clues', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Synonyms</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSynonym}
                  onChange={(e) => setNewSynonym(e.target.value)}
                  placeholder="Add a synonym"
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), addToArray('synonyms', newSynonym, setNewSynonym))
                  }
                />
                <Button
                  type="button"
                  onClick={() => addToArray('synonyms', newSynonym, setNewSynonym)}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.synonyms.map((synonym, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {synonym}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFromArray('synonyms', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Further Characteristics</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCharacteristic}
                  onChange={(e) => setNewCharacteristic(e.target.value)}
                  placeholder="Add a characteristic"
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    addToArray('furtherCharacteristics', newCharacteristic, setNewCharacteristic))
                  }
                />
                <Button
                  type="button"
                  onClick={() =>
                    addToArray('furtherCharacteristics', newCharacteristic, setNewCharacteristic)
                  }
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.furtherCharacteristics.map((char, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {char}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFromArray('furtherCharacteristics', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Word'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordForm;
