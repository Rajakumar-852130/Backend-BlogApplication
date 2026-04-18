import { Calendar, User, ArrowRight, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="card group overflow-hidden flex flex-col h-full">
      <div className="h-48 bg-slate-200 dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider z-10 shadow-lg">
          {post.category || 'General'}
        </div>
        <img 
          src={post.imageUrl || defaultImage} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
           <span className="flex items-center gap-1"><User size={12} className="text-blue-600 dark:text-blue-500" /> {post.author}</span>
           <span className="flex items-center gap-1"><Calendar size={12} className="text-blue-600 dark:text-blue-500" /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
        </div>

        <h3 className="text-lg font-bold mb-3 line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 italic leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content ? post.content.replace(/<[^>]*>?/gm, '') : '' }}
        />
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
              <Heart size={14} className={post.likes > 0 ? "fill-red-500 text-red-500" : ""} />
              <span className="text-xs font-bold">{post.likes || 0}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              <span className="text-xs font-bold">{post.views || 0}</span>
            </span>
          </div>
          <Link 
            to={`/post/${post.id}`}
            className="text-blue-500 font-bold hover:text-blue-400 flex items-center gap-1 text-sm group/btn"
          >
            Read Story <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
