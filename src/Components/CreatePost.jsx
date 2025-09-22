import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../client';
import { useAuth } from '../Context/AuthContext';
import './posts.css';

function CreatePost({ isEditing }) {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If editing, fetch the post data
  useEffect(() => {
    if (isEditing && id) {
      const fetchPost = async () => {
        try {
          console.log("Fetching post with ID:", id);
          
          const { data, error } = await supabase
            .from('Posts')
            .select('*')
            .eq('id', id)
            .single();
            
          console.log("Fetch post response:", { data, error });
            
          if (error) throw error;
          
          if (data) {
            setPost(data);
            setTitle(data.title);
            setDescription(data.description);
            console.log("Post data loaded successfully");
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to load post for editing');
        }
      };
      
      fetchPost();
    }
  }, [isEditing, id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEditing && id) {
        // Log the update attempt
        console.log("Attempting to update post:", id);
        console.log("Update data:", { title, description });
        
        // Update existing post
        const { data, error } = await supabase
          .from('Posts')
          .update({ 
            title, 
            description 
          })
          .eq('id', id);
          
        console.log("Update response:", { data, error });
          
        if (error) throw error;
        
        console.log("Post updated successfully!");
        navigate(`/post/${id}`);
      } else {
        // Create new post
        const postData = { 
          title, 
          description, 
          author: user?.email || 'unknown',
          upvotes: 0
        };
        
        console.log("Creating new post:", postData);
        
        const { data, error } = await supabase
          .from('Posts')
          .insert([postData]);
          
        console.log("Insert response:", { data, error });
        
        if (error) throw error;
        
        console.log("Post created successfully!");
        navigate('/home');
      }
    } catch (error) {
      console.error('Error details:', error);
      setError(`Failed to ${isEditing ? 'update' : 'save'} post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    try {
      setDeleteLoading(true);
      console.log("Attempting to delete post:", id);
      
      const { data, error } = await supabase
        .from('Posts')
        .delete()
        .eq('id', id);
        
      console.log("Delete response:", { data, error });
        
      if (error) throw error;
      
      console.log("Post successfully deleted");
      navigate('/home');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post: ' + error.message);
      setDeleteLoading(false);
    }
  };
  
  return (
    <div className="create-post-container">
      <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            rows="6"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="delete-btn" 
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Post'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreatePost;