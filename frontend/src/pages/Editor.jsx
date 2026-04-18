import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsApi } from '../api/api';
import { Save, X, Type, User, Layout, FileText, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadApi } from '../api/api';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ]
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [post, setPost] = useState({
    title: '',
    author: '',
    category: '',
    content: ''
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(post.imageUrl || '');

  async function fetchPost() {
    try {
      const response = await postsApi.getOne(id);
      setPost(response.data);
    } catch (_error) {
      toast.error('Could not load post data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post.imageUrl) setImagePreview(post.imageUrl);
  }, [post.imageUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await uploadApi.upload(formData);
      const url = response.data.url;
      setPost({ ...post, imageUrl: url });
      setImagePreview(url);
      toast.success('Image uploaded successfully!');
    } catch (_error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await postsApi.update(id, post);
        toast.success('Post updated successfully!');
      } else {
        await postsApi.create(post);
        toast.success('New post published!');
      }
      navigate('/');
    } catch (_error) {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="container-custom max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </h1>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
              <Type size={16} /> Title
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Post title..."
              value={post.title}
              onChange={(e) => setPost({...post, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
              <User size={16} /> Author
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Your name..."
              value={post.author}
              onChange={(e) => setPost({...post, author: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
            <ImageIcon size={16} /> Thumbnail Image
          </label>
          <div className="mt-2 flex items-center gap-6">
            <div className="w-32 h-24 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700/50 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-slate-400 dark:text-slate-600" size={32} />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <label 
                htmlFor="file-upload" 
                className="btn-primary w-fit cursor-pointer text-sm py-2 px-4 bg-slate-100 text-slate-700 hover:text-white dark:text-white dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-slate-600 shadow-none border border-slate-300 dark:border-slate-600/50"
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                {imagePreview ? 'Change Image' : 'Upload Thumbnail'}
              </label>
              <p className="text-[10px] text-slate-500 mt-2">Recommended size: 1200x800px. JPG, PNG or WebP.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
            <Layout size={16} /> Category
          </label>
          <select 
            className="input-field"
            value={post.category}
            onChange={(e) => setPost({...post, category: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
            <option value="Travel">Travel</option>
            <option value="Health">Health</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
            <FileText size={16} /> Content
          </label>
          <div className="quill-wrapper min-h-[350px]">
            <ReactQuill 
              theme="snow"
              value={post.content}
              onChange={(value) => setPost({...post, content: value})}
              modules={modules}
              className="h-[300px]"
              placeholder="Write your story here..."
            />
          </div>
        </div>

        <div className="pt-6 mt-16 md:mt-2 border-t border-slate-200 dark:border-slate-700/50 flex justify-end gap-4 relative z-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isEdit ? 'Save Changes' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
