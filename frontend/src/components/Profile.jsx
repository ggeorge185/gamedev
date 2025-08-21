import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle, Trash } from 'lucide-react';
import { followUser, unfollowUser } from '@/redux/authSlice';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from './ui/dialog';

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);
    const [activeTab, setActiveTab] = useState('posts');
    const [selectedPost, setSelectedPost] = useState(null);
    const dispatch = useDispatch();

    const { userProfile, user } = useSelector(store => store.auth);

    const isLoggedInUserProfile = user?._id === userProfile?._id;
    const isFollowing = user?.following.includes(userProfile?._id);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

    const handleFollow = async () => {
        try {
            await axios.post(`https://euphora.onrender.com/follow/${userProfile?._id}`, {}, { withCredentials: true });
            dispatch(followUser(userProfile?._id));
        } catch (error) {
            console.error("Follow error:", error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.post(`https://euphora.onrender.com/unfollow/${userProfile?._id}`, {}, { withCredentials: true });
            dispatch(unfollowUser(userProfile?._id));
        } catch (error) {
            console.error("Unfollow error:", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`https://euphora.onrender.com/posts/${postId}`, { withCredentials: true });
            // Update the user profile after deletion
            useGetUserProfile(userId);
        } catch (error) {
            console.error("Delete post error:", error);
        }
    };

    const handleCommentClick = (post) => {
        alert(`Comments for post: ${post._id}`);
    };

    const handlePhotoClick = (post) => {
        setSelectedPost(post);
    };

    const handleCloseDialog = () => {
        setSelectedPost(null);
    };

    return (
        <div className='flex max-w-5xl justify-center mx-auto pl-10'>
            <div className='flex flex-col gap-20 p-8'>
                <div className='grid grid-cols-2'>
                    <section className='flex items-center justify-center'>
                        <Avatar className='h-32 w-32'>
                            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
                            <AvatarFallback>
                            <img src="/profile.png" alt="Fallback Profile" />
                            </AvatarFallback>
                        </Avatar>
                    </section>
                    <section>
                        <div className='flex flex-col gap-5'>
                            <div className='flex items-center gap-2'>
                                <span>{userProfile?.username}</span>
                                {isLoggedInUserProfile ? (
                                    <>
                                        <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                                    </>
                                ) : (
                                    isFollowing ? (
                                        <>
                                            <Button onClick={handleUnfollow} variant='secondary' className='h-8'>Unfollow</Button>
                                            <Button variant='secondary' className='h-8'>Message</Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleFollow} className='bg-[#800000] hover:bg-[#b22222] h-8'>Follow</Button>
                                    )
                                )}
                            </div>
                            <div className='flex items-center gap-4'>
                                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
                            </div>
                        </div>
                    </section>
                </div>
                <div className='border-t border-t-gray-200'>
                    <div className='flex items-center justify-center gap-10 text-sm'>
                        <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
                            POSTS
                        </span>
                        <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
                            SAVED
                        </span>
                    </div>
                    <div className='grid grid-cols-3 gap-1'>
                        {displayedPost?.map((post) => (
                            <div key={post?._id} className='relative group cursor-pointer' onClick={() => handlePhotoClick(post)}>
                                <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <div className='flex items-center text-white space-x-4'>
                                        <button className='flex items-center gap-2 hover:text-gray-300'>
                                            <Heart />
                                            <span>{post?.likes.length}</span>
                                        </button>
                                        <button className='flex items-center gap-2 hover:text-gray-300' onClick={(e) => { e.stopPropagation(); handleCommentClick(post); }}>
                                            <MessageCircle />
                                            <span>{post?.comments.length}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedPost && (
                <Dialog open={!!selectedPost} onOpenChange={handleCloseDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Post Details</DialogTitle>
                        </DialogHeader>
                        <div>
                            <img src={selectedPost.image} alt='postimage' className='w-full aspect-square object-cover' />
                            <div className='flex items-center justify-around mt-4'>
                                <button className='flex items-center gap-2'>
                                    <Heart />
                                    <span>{selectedPost.likes.length}</span>
                                </button>
                                <button className='flex items-center gap-2'>
                                    <MessageCircle />
                                    <span>{selectedPost.comments.length}</span>
                                </button>
                                {isLoggedInUserProfile && (
                                    <button onClick={() => handleDeletePost(selectedPost._id)} className='flex items-center gap-2 text-red-600'>
                                        <Trash />
                                        <span>Delete</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Profile;
