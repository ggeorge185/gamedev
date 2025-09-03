import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`https://euphora.onrender.com/api/v1/user/search?query=${searchTerm}`);
            if (res.data.success) {
                setSearchResults(res.data.results);
            }
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    };

    return (
        <div className='p-4' style={{ marginLeft: '16%', marginRight: '16%' }}>
            <h1 className='text-2xl font-bold mb-4'>Search Users</h1>
            <div className='flex mb-4'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='flex-1 p-2 border border-gray-300 rounded'
                    placeholder='Search for users...'
                />
                <button onClick={handleSearch} className='ml-2 p-2 bg-black text-white rounded'>Search</button>
            </div>
            <div className='mt-4'>
                {searchResults.map(user => (
                    <div key={user._id} className='flex items-center mb-4'>
                        <Avatar className='w-10 h-10'>
                            <AvatarImage src={user.profilePicture} alt='Profile Picture' />
                            <AvatarFallback>  <img src="profile.png" alt="Fallback Profile" /></AvatarFallback>
                        </Avatar>
                        <span className='ml-2'>{user.username}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
