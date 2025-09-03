import React, { useEffect, useState } from 'react';
import { Dialog } from './ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveStoryIndex, setViewerOpen } from '@/redux/storySlice';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const StoryViewer = () => {
    const dispatch = useDispatch();
    const { isViewerOpen, viewingStories, activeStoryIndex } = useSelector(state => state.story);
    const [progress, setProgress] = useState(0);
    const storyDuration = 5000; // 5 seconds per story
    const stories = viewingStories?.stories || [];

    useEffect(() => {
        if (!isViewerOpen || !viewingStories) return;

        let startTime = Date.now();
        let animationFrame;
        let storyTimeout;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = (elapsed / storyDuration) * 100;

            if (newProgress >= 100) {
                if (activeStoryIndex < stories.length - 1) {
                    dispatch(setActiveStoryIndex(activeStoryIndex + 1));
                    startTime = Date.now();
                } else {
                    dispatch(setViewerOpen(false));
                    dispatch(setActiveStoryIndex(0));
                    return;
                }
            }

            setProgress(Math.min(newProgress, 100));
            animationFrame = requestAnimationFrame(animate);
        };

        const markAsViewed = async () => {
            try {
                await axios.post(
                    `https://euphora.onrender.com/api/v1/story/${stories[activeStoryIndex]._id}/view`,
                    {},
                    { withCredentials: true }
                );
            } catch (error) {
                console.error('Error marking story as viewed:', error);
            }
        };

        markAsViewed();
        animate();
        storyTimeout = setTimeout(() => {
            if (activeStoryIndex < stories.length - 1) {
                dispatch(setActiveStoryIndex(activeStoryIndex + 1));
            } else {
                dispatch(setViewerOpen(false));
                dispatch(setActiveStoryIndex(0));
            }
        }, storyDuration);

        return () => {
            cancelAnimationFrame(animationFrame);
            clearTimeout(storyTimeout);
        };
    }, [activeStoryIndex, isViewerOpen, stories.length, dispatch, viewingStories, stories]);

    const handlePrevious = (e) => {
        e.stopPropagation();
        if (activeStoryIndex > 0) {
            dispatch(setActiveStoryIndex(activeStoryIndex - 1));
            setProgress(0);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (activeStoryIndex < stories.length - 1) {
            dispatch(setActiveStoryIndex(activeStoryIndex + 1));
            setProgress(0);
        } else {
            dispatch(setViewerOpen(false));
            dispatch(setActiveStoryIndex(0));
        }
    };

    const handleClose = () => {
        dispatch(setViewerOpen(false));
        dispatch(setActiveStoryIndex(0));
        setProgress(0);
    };

    if (!viewingStories || !isViewerOpen) return null;

    const currentStory = stories[activeStoryIndex];
    const timeSince = new Date(currentStory.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <Dialog open={isViewerOpen} onOpenChange={handleClose}>
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="relative w-full h-full max-w-3xl mx-auto">
                    {/* Progress Bars */}
                    <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
                        {stories.map((story, index) => (
                            <div 
                                key={story._id} 
                                className="h-1 flex-1 bg-gray-600 rounded overflow-hidden"
                            >
                                <div 
                                    className="h-full bg-white"
                                    style={{ 
                                        width: `${index === activeStoryIndex ? progress : index < activeStoryIndex ? 100 : 0}%`,
                                        transition: index === activeStoryIndex ? 'width 0.1s linear' : 'none'
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
                        {/* User Info */}
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={viewingStories.user.profilePicture} />
                                <AvatarFallback>
                                    {viewingStories.user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-white">
                                <p className="text-sm font-semibold">{viewingStories.user.username}</p>
                                <p className="text-xs opacity-75">{timeSince}</p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={handleClose}
                            className="text-white hover:opacity-75 transition-opacity"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Story Content */}
                    <div className="w-full h-full flex items-center justify-center">
                        <img 
                            src={currentStory.media || "/placeholder.svg"} 
                            alt="story"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Navigation Buttons */}
                    {activeStoryIndex > 0 && (
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    {activeStoryIndex < stories.length - 1 && (
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}

                    {/* Navigation Overlays */}
                    <div 
                        className="absolute left-0 top-0 w-1/3 h-full cursor-pointer" 
                        onClick={handlePrevious}
                    />
                    <div 
                        className="absolute right-0 top-0 w-1/3 h-full cursor-pointer" 
                        onClick={handleNext}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default StoryViewer;

