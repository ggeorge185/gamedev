import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/utils/api';

const useGetTopics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(API_ENDPOINTS.words.getTopics, { 
                    withCredentials: true 
                });
                
                if (response.data.success) {
                    setTopics(response.data.topics);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch topics');
                }
            } catch (error) {
                console.error('Failed to fetch topics:', error);
                setError(error.response?.data?.message || error.message || 'Failed to fetch topics');
                setTopics([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    return { topics, loading, error };
};

export default useGetTopics;