import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([])
  const baseUrl = import.meta.env.VITE_BASE_URL;

useEffect(()=>{
  const fetchPosts = async () => {
    try {
        const res = await fetch(`${baseUrl}/api/posts`);
        const data = await res.json();
        setPosts(data.allPosts)
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    } 
  };
  fetchPosts();
}, []);

  return (
    <div>
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'> 
        Welcome to my Blog!
        </h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
        Explore captivating stories and intriguing insights that will spark your imagination and fuel your creativity. Whether you're here for adventure, fantasy, or knowledge, you're in for an unforgettable journey through the wonders of storytelling! 
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

       <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
