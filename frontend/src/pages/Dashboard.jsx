import { useState, useEffect } from 'react';
import { statsApi } from '../api/api';
import { Layout, Users, User, Heart, Eye, TrendingUp, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all">
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-xl group-hover:scale-110 transition-transform`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchStats() {
        try {
            const response = await statsApi.getStats();
            setStats(response.data);
        } catch (_error) {
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container-custom py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 mb-4">Dashboard Unavailable</h2>
                <p className="text-slate-600 dark:text-slate-500 mb-8">We couldn't load your analytics data at this time.</p>
                <button onClick={fetchStats} className="btn-primary mx-auto">Retry Loading</button>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                    <TrendingUp size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 italic">Content <span className="text-blue-600 dark:text-blue-500">Analytics</span></h1>
                    <p className="text-slate-600 dark:text-slate-400">Track your blog's performance and audience engagement.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard 
                    title="Total Posts" 
                    value={stats.totalPosts} 
                    icon={BookOpen} 
                    color="text-blue-500 bg-blue-500" 
                />
                <StatCard 
                    title="Total Views" 
                    value={stats.totalViews} 
                    icon={Eye} 
                    color="text-purple-500 bg-purple-500" 
                />
                <StatCard 
                    title="Total Likes" 
                    value={stats.totalLikes} 
                    icon={Heart} 
                    color="text-red-500 bg-red-500" 
                />
                <StatCard 
                    title="Active Authors" 
                    value={stats.totalUsers} 
                    icon={Users} 
                    color="text-green-500 bg-green-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="card p-8 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="text-blue-500" size={20} /> Popular Stories
                            </h2>
                        </div>
                        
                        <div className="space-y-6">
                            {stats.topPosts?.length > 0 ? stats.topPosts.map((post, idx) => (
                                <div key={post.id} className="flex items-center gap-6 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors group">
                                    <div className="text-2xl font-black text-slate-300 dark:text-slate-700 w-8 group-hover:text-blue-500/50 transition-colors">
                                        0{idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{post.title}</h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1.5">
                                                <Heart size={14} className="text-red-500 fill-red-500/20" /> {post.likes}
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase font-black">{post.views} Views</div>
                                        </div>
                                        <Link to={`/post/${post.id}`} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all">
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-center py-20 italic">No popular posts yet. Start writing!</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 border-none">
                        <h3 className="text-xl font-bold mb-2">Write New Story</h3>
                        <p className="text-blue-100 text-sm mb-6">Share your ideas with the world and grow your audience.</p>
                        <Link to="/create" className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all active:scale-95">
                            <BookOpen size={20} /> Start Writing
                        </Link>
                    </div>
                    
                    <div className="card p-6 border-slate-200 dark:border-slate-700/30">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                             <Layout size={18} className="text-blue-500" /> Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Avg. Likes/Post</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {stats.totalPosts > 0 ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Avg. Views/Post</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {stats.totalPosts > 0 ? (stats.totalViews / stats.totalPosts).toFixed(0) : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
