import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsApi, commentsApi } from '../api/api';
import { Calendar, User, ArrowLeft, Trash2, Edit3, MessageCircle, Send, Loader2, Heart, Eye, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ commenterName: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const viewIncremented = useRef(false);

    async function fetchPostAndComments() {
        try {
            const [postRes, commentsRes] = await Promise.all([
                postsApi.getOne(id),
                commentsApi.getByPostId(id)
            ]);
            setPost(postRes.data);
            setComments(commentsRes.data);
        } catch (_error) {
            toast.error('Post not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }

    async function handleView() {
        try {
            await postsApi.view(id);
        } catch (_err) {
            console.error("View increment failed");
        }
    }

    useEffect(() => {
        fetchPostAndComments();
        if (!viewIncremented.current) {
            handleView();
            viewIncremented.current = true;
        }
    }, [id]);

    const handleLike = async () => {
        if (liked) return;
        try {
            const response = await postsApi.like(id);
            setPost(response.data);
            setLiked(true);
            toast.success('Post liked! ❤️');
        } catch (_error) {
            toast.error('Failed to like post');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postsApi.delete(id);
                toast.success('Post deleted successfully');
                navigate('/');
            } catch (_error) {
                toast.error('Failed to delete post');
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.content || !newComment.commenterName) return;
        try {
            const response = await commentsApi.add(id, newComment);
            setComments([...comments, response.data]);
            setNewComment({ commenterName: '', content: '' });
            toast.success('Comment added!');
        } catch (_error) {
            toast.error('Failed to add comment');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-slate-400">Loading your story...</p>
            </div>
        );
    }

    if (!post) return null;

    const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200";

    return (
        <div className="container-custom max-w-4xl py-6 pb-20">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to explore
            </Link>

            <article className="card overflow-hidden mb-12 border-none bg-transparent shadow-none">
                {/* Hero Image */}
                <div className="w-full h-80 md:h-[450px] rounded-3xl overflow-hidden mb-10 relative group">
                    <img
                        src={post.imageUrl || defaultImage}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 flex gap-3">
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                            {post.category || 'General'}
                        </span>
                    </div>
                </div>

                <div className="px-2">
                    {/* Meta + Edit/Delete */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-500 font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20">
                                    <User size={14} />
                                </div>
                                <span className="text-slate-800 dark:text-slate-200">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-blue-600 dark:text-blue-500" />
                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-blue-600 dark:text-blue-500" />
                                <span>{post.views || 0} Views</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                to={`/edit/${post.id}`}
                                className="p-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                                title="Edit post"
                            >
                                <Edit3 size={18} />
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="p-3 rounded-xl bg-red-100 dark:bg-red-600/10 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-200 dark:border-red-600/20"
                                title="Delete post"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-black mb-10 text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                        {post.title}
                    </h1>

                    {/* Content */}
                    <div
                        className="ql-editor !p-0 mb-16 text-slate-800 dark:text-slate-300 text-xl leading-[1.7] whitespace-pre-wrap opacity-90 lg:pr-10"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Like & Share Bar */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/30 mb-20 shadow-inner">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-3 transition-all duration-300 ${liked ? 'text-red-500 scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:scale-105 active:scale-95'}`}
                            >
                                <Heart size={28} className={liked ? "fill-red-500" : ""} />
                                <div className="text-left">
                                    <p className="text-lg font-black leading-none">{post.likes || 0}</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">Likes</p>
                                </div>
                            </button>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <MessageCircle size={28} />
                                <div className="text-left">
                                    <p className="text-lg font-black leading-none text-slate-800 dark:text-slate-200">{comments.length}</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500">Comments</p>
                                </div>
                            </div>
                        </div>
                        <button className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <section className="card p-8 md:p-12 border-slate-200 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-500">
                        <MessageCircle size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Join the <span className="text-blue-600 dark:text-blue-500">Discussion</span></h2>
                </div>

                <form onSubmit={handleCommentSubmit} className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Your Name</label>
                            <input
                                type="text"
                                placeholder="e.g. CodeWizard"
                                className="input-field h-12"
                                value={newComment.commenterName}
                                onChange={(e) => setNewComment({ ...newComment, commenterName: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Message</label>
                        <div className="relative">
                            <textarea
                                placeholder="Share your thoughts or feedback..."
                                className="input-field h-40 pt-4 resize-none"
                                value={newComment.content}
                                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                required
                            />
                            <button
                                type="submit"
                                className="absolute bottom-4 right-4 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </form>

                <div className="space-y-8">
                    {comments.length > 0 ? comments.map((comment) => (
                        <div key={comment.id} className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/20 group hover:border-blue-300 dark:hover:border-blue-500/30 shadow-sm dark:shadow-none transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 dark:from-blue-600/20 to-indigo-100 dark:to-indigo-600/20 flex items-center justify-center font-black text-blue-600 dark:text-blue-500 text-xl shadow-inner group-hover:scale-110 transition-transform">
                                {comment.commenterName[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-black text-slate-800 dark:text-slate-100 italic tracking-tight">{comment.commenterName}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700/50">
                            <MessageCircle className="mx-auto text-slate-400 dark:text-slate-700 mb-4" size={48} />
                            <p className="text-slate-500 dark:text-slate-600 font-bold uppercase tracking-widest">Be the first to comment</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
