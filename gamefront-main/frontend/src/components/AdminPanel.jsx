import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';

const AdminPanel = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingDeployment, setEditingDeployment] = useState(null);
    const [formData, setFormData] = useState({
        scenario: 'accommodation',
        level: 'A1',
        availableGames: []
    });

    const scenarios = [
        { id: 'accommodation', name: 'Finding Accommodation' },
        { id: 'city_registration', name: 'City Registration' },
        { id: 'university', name: 'University Life' },
        { id: 'banking', name: 'Banking & Finance' },
        { id: 'everyday_items', name: 'Everyday Shopping' }
    ];

    const levels = ['A1', 'A2', 'B1', 'B2'];

    const gameTypes = [
        { id: 'memory', name: 'Memory Game', icon: '🧠' },
        { id: 'scrabble', name: 'Scrabble Game', icon: '🔠' },
        { id: 'anagrams', name: 'Anagrams', icon: '🔤' },
        { id: 'quiz', name: 'Quiz Challenge', icon: '❓' },
        { id: 'taboo', name: 'Taboo Game', icon: '🚫' },
        { id: 'jumbled_letters', name: 'Jumbled Letters', icon: '🔤' }
    ];

    useEffect(() => {
        fetchDeployments();
    }, []);

    const fetchDeployments = async () => {
        try {
            const response = await axios.get('/api/v1/admin/deployments', {
                withCredentials: true
            });
            if (response.data.success) {
                setDeployments(response.data.deployments);
            }
        } catch (error) {
            console.error('Error fetching deployments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDeployment = async () => {
        try {
            const response = await axios.post('/api/v1/admin/deployments', formData, {
                withCredentials: true
            });
            if (response.data.success) {
                setDeployments([...deployments, response.data.deployment]);
                resetForm();
                setShowCreateForm(false);
            }
        } catch (error) {
            console.error('Error creating deployment:', error);
            alert('Error creating deployment: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteDeployment = async (deploymentId) => {
        if (!window.confirm('Are you sure you want to delete this deployment?')) {
            return;
        }

        try {
            await axios.delete(`/api/v1/admin/deployments/${deploymentId}`, {
                withCredentials: true
            });
            setDeployments(deployments.filter(d => d._id !== deploymentId));
        } catch (error) {
            console.error('Error deleting deployment:', error);
            alert('Error deleting deployment');
        }
    };

    const handleGameToggle = (gameType) => {
        const existingGameIndex = formData.availableGames.findIndex(g => g.gameType === gameType);
        
        if (existingGameIndex >= 0) {
            // Remove game
            setFormData({
                ...formData,
                availableGames: formData.availableGames.filter(g => g.gameType !== gameType)
            });
        } else {
            // Add game with default settings
            setFormData({
                ...formData,
                availableGames: [
                    ...formData.availableGames,
                    {
                        gameType,
                        isActive: true,
                        maxScore: 100,
                        timeLimit: 10
                    }
                ]
            });
        }
    };

    const updateGameSettings = (gameType, field, value) => {
        setFormData({
            ...formData,
            availableGames: formData.availableGames.map(game =>
                game.gameType === gameType
                    ? { ...game, [field]: field === 'isActive' ? value : parseInt(value) }
                    : game
            )
        });
    };

    const resetForm = () => {
        setFormData({
            scenario: 'accommodation',
            level: 'A1',
            availableGames: []
        });
        setEditingDeployment(null);
    };

    const startEdit = (deployment) => {
        setFormData({
            scenario: deployment.scenario,
            level: deployment.level,
            availableGames: deployment.availableGames
        });
        setEditingDeployment(deployment._id);
        setShowCreateForm(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl mb-4">Loading admin panel...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Game Deployment Admin</h1>
                        <p className="text-gray-600">Configure which games are available for each scenario and level</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Deployment
                    </Button>
                </div>

                {/* Create/Edit Form */}
                {showCreateForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingDeployment ? 'Edit Deployment' : 'Create New Deployment'}
                            </h2>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    resetForm();
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Basic Settings */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scenario
                                </label>
                                <select
                                    value={formData.scenario}
                                    onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {scenarios.map(scenario => (
                                        <option key={scenario.id} value={scenario.id}>
                                            {scenario.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Level
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Available Games */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Available Games
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {gameTypes.map(gameType => {
                                    const isSelected = formData.availableGames.find(g => g.gameType === gameType.id);
                                    return (
                                        <div
                                            key={gameType.id}
                                            className={`border rounded-lg p-4 ${
                                                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-2">{gameType.icon}</span>
                                                    <span className="font-medium">{gameType.name}</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={!!isSelected}
                                                    onChange={() => handleGameToggle(gameType.id)}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                            </div>
                                            
                                            {isSelected && (
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <label className="block text-gray-700">Max Score</label>
                                                        <input
                                                            type="number"
                                                            value={isSelected.maxScore}
                                                            onChange={(e) => updateGameSettings(gameType.id, 'maxScore', e.target.value)}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700">Time (min)</label>
                                                        <input
                                                            type="number"
                                                            value={isSelected.timeLimit}
                                                            onChange={(e) => updateGameSettings(gameType.id, 'timeLimit', e.target.value)}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateDeployment}
                                disabled={formData.availableGames.length === 0}
                                className="bg-green-500 hover:bg-green-600 flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {editingDeployment ? 'Update' : 'Create'} Deployment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Deployments List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Current Deployments</h2>
                    </div>
                    
                    {deployments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No deployments configured yet. Create your first deployment to get started.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Scenario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Available Games
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deployments.map((deployment) => (
                                        <tr key={deployment._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    {scenarios.find(s => s.id === deployment.scenario)?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {deployment.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {deployment.availableGames.map((game) => {
                                                        const gameInfo = gameTypes.find(gt => gt.id === game.gameType);
                                                        return (
                                                            <span
                                                                key={game.gameType}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                            >
                                                                {gameInfo?.icon} {gameInfo?.name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => startEdit(deployment)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteDeployment(deployment._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;