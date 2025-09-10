import React from 'react'
import WordList from './WordList'

const Home = () => (
  <div className="ml-64 px-4 py-8"> {/* ml-64 = margin-left: 16rem */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        German Word Collection
      </h1>
      <p className="text-gray-600">
        Discover and learn German words with detailed information
      </p>
    </div>
    <WordList />
  </div>
);

export default Home;
