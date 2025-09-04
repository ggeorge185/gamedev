import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

const AccommodationScenario = () => {
    const navigate = useNavigate();
    const { scenarioId } = useParams();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/story-mode')}
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Story Mode
                    </Button>
                    <div className="flex items-center">
                        <div className="text-4xl mr-4">🏠</div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Finding Accommodation</h1>
                            <p className="text-gray-600">Help Alex find the perfect place to live in Germany</p>
                        </div>
                    </div>
                </div>

                {/* Blank page content as requested */}
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-6xl mb-6">🏗️</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Scenario Under Development
                    </h2>
                    <p className="text-gray-600 mb-6">
                        This scenario is currently being developed. Check back soon for Alex's accommodation adventure!
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 text-sm">
                            <strong>Coming Soon:</strong> Interactive apartment search, German rental vocabulary, and communication with landlords.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccommodationScenario;