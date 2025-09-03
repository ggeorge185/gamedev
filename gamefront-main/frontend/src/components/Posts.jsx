import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  // Sort posts by creation time in descending order
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      {sortedPosts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default Posts;
