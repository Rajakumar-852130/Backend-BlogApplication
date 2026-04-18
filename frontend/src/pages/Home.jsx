import { useState, useEffect } from 'react';
import { postsApi } from '../api/api';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

const Home = ({ searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Technology', 'Lifestyle', 'Business', 'Travel', 'Health'];

  async function fetchPosts() {
    try {
      const response = await postsApi.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={40} />
        <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading amazing stories...</p>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="mb-10 py-8 border-b border-slate-200 dark:border-slate-800/50">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
          Latest <span className="text-blue-600 dark:text-blue-500">Insights</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg mb-8">
          Explore stories, tutorials and thoughts from our community.
        </p>

        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'bg-slate-200 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No posts found matching exactly what you're looking for.</p>
          <button 
            onClick={() => {
              setActiveCategory('All');
            }} 
            className="mt-4 px-6 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
