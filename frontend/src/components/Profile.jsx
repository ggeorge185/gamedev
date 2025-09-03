import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, User, Calendar, Mail } from 'lucide-react';
import WordCard from './WordCard';
import axios from 'axios';
import { toast } from 'sonner';

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    const { user } = useSelector(store => store.auth);
    const [userProfile, setUserProfile] = useState(null);
    const [userWords, setUserWords] = useState([]);
    const [loading, setLoading] = useState(false);

    const isLoggedInUserProfile = user?._id === userId;

    useEffect(() => {
        fetchUserProfile();
        fetchUserWords();
    }, [userId]);

    const fetchUserProfile = async () => {
    try {
        const res = await axios.get(`/api/v1/user/profile/${userId}`, {
            withCredentials: true
        });
        if (res.data.success && res.data.user) {
            setUserProfile(res.data.user);
        } else {
            setUserProfile(false); // not found or error
        }
    } catch (error) {
        setUserProfile(false); // also on error
        toast.error(error.response?.data?.message || 'Failed to fetch profile');
    }
};

    const fetchUserWords = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/word/user${isLoggedInUserProfile ? '' : `?author=${userId}`}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setUserWords(res.data.words);
            }
        } catch (error) {
            // Don't show error for empty word collection
            setUserWords([]);
        } finally {
            setLoading(false);
        }
    };
    if (userProfile === null) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">Loading profile...</div>
        </div>
        );
    }
    if (userProfile === false) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg text-red-600">Profile not found!</div>
            </div>
        );
    }
    

    return (
        <div className='max-w-5xl mx-auto p-4'>
            {/* Profile Header */}
            <div className='bg-white rounded-lg shadow-sm border p-6 mb-6'>
                <div className='flex flex-col md:flex-row items-center gap-6'>
                    <Avatar className='w-24 h-24'>
                        <AvatarImage src={userProfile?.profilePicture} alt={userProfile?.username} />
                        <AvatarFallback className="text-2xl">
                            <User className="w-8 h-8" />
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className='flex-1 text-center md:text-left'>
                        <h1 className='text-2xl font-bold mb-2'>{userProfile?.username}</h1>
                        
                        {userProfile?.bio && (
                            <p className='text-gray-600 mb-4'>{userProfile.bio}</p>
                        )}
                        
                        <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500'>
                            <div className='flex items-center gap-1'>
                                <Mail className='w-4 h-4' />
                                {userProfile?.email}
                            </div>
                            <div className='flex items-center gap-1'>
                                <Calendar className='w-4 h-4' />
                                Joined {new Date(userProfile?.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Stats */}
                <div className='grid grid-cols-3 gap-4 mt-6 pt-6 border-t'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-600'>{userWords.length}</div>
                        <div className='text-sm text-gray-600'>Words</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-green-600'>
                            {userWords.filter(word => word.languageLevel === 'A1' || word.languageLevel === 'A2').length}
                        </div>
                        <div className='text-sm text-gray-600'>Beginner</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-purple-600'>
                            {userWords.filter(word => word.languageLevel === 'B1' || word.languageLevel === 'B2' || word.languageLevel === 'C1' || word.languageLevel === 'C2').length}
                        </div>
                        <div className='text-sm text-gray-600'>Advanced</div>
                    </div>
                </div>
            </div>

            {/* Words Section */}
            <div className='bg-white rounded-lg shadow-sm border p-6'>
                <div className='flex items-center gap-2 mb-6'>
                    <BookOpen className='w-5 h-5 text-blue-600' />
                    <h2 className='text-xl font-semibold'>
                        {isLoggedInUserProfile ? 'My German Words' : `${userProfile?.username}'s German Words`}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500">Loading words...</div>
                    </div>
                ) : userWords.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <div className="text-gray-500 text-lg mb-2">
                            {isLoggedInUserProfile ? 'No words in your collection yet' : 'No words shared by this user'}
                        </div>
                        <div className="text-gray-400">
                            {isLoggedInUserProfile && 'Start building your German vocabulary!'}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userWords.map(word => (
                            <WordCard key={word._id} word={word} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
