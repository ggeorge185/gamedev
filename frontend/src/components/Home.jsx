import React from 'react'
import WordList from './WordList'

const Home = () => {
    return (
        <div className='flex justify-center min-h-screen bg-gray-50'>
            <div className='w-full max-w-7xl'>
                <div className='py-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            German Word Collection
                        </h1>
                        <p className='text-gray-600'>
                            Discover and learn German words with detailed information
                        </p>
                    </div>
                    <WordList />
                </div>
            </div>
        </div>
    )
}

export default Home