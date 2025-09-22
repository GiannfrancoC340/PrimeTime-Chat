import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import { useAuth } from '../Context/AuthContext';
import Comments from './Comments';
import { getUsernameFromEmail } from '../utils'; // Make sure the path is correct
import './posts.css';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [userVote, setUserVote] = useState(null); // null, 'upvote', or 'downvote'
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPostAndVoteStatus = async () => {
      try {
        console.log("Fetching post with ID:", id);
        
        // Fetch the post
        const { data: postData, error: postError } = await supabase
          .from('Posts')
          .select('*')
          .eq('id', id)
          .single();
          
        if (postError) throw postError;
        
        setPost(postData);
        
        // Check if the current user has voted on this post
        if (user) {
          const { data: voteData, error: voteError } = await supabase
            .from('PostVotes')
            .select('vote_type')
            .eq('post_id', id)
            .eq('user_email', user.email)
            .maybeSingle();
          
          if (voteError) throw voteError;
          
          setUserVote(voteData ? voteData.vote_type : null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostAndVoteStatus();
  }, [id, user]);
  
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
  
  const handleVote = async (voteType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setVoteLoading(true);
      
      // We need to handle 3 cases:
      // 1. User hasn't voted yet -> Insert new vote
      // 2. User voted the same way -> Remove vote
      // 3. User voted the opposite way -> Update vote
      
      if (!userVote) {
        // Case 1: New vote
        const { error: voteError } = await supabase
          .from('PostVotes')
          .insert({
            post_id: id,
            user_email: user.email,
            vote_type: voteType
          });
          
        if (voteError) throw voteError;
        
        // Update post vote counts
        const updates = {};
        if (voteType === 'upvote') {
          updates.upvotes = post.upvotes + 1;
        } else {
          updates.downvotes = post.downvotes + 1;
        }
        
        const { error: updateError } = await supabase
          .from('Posts')
          .update(updates)
          .eq('id', id);
          
        if (updateError) throw updateError;
        
        // Update local state
        setPost({
          ...post,
          ...updates
        });
        setUserVote(voteType);
      } 
      else if (userVote === voteType) {
        // Case 2: Remove vote
        const { error: deleteError } = await supabase
          .from('PostVotes')
          .delete()
          .eq('post_id', id)
          .eq('user_email', user.email);
          
        if (deleteError) throw deleteError;
        
        // Update post vote counts
        const updates = {};
        if (voteType === 'upvote') {
          updates.upvotes = Math.max(0, post.upvotes - 1);
        } else {
          updates.downvotes = Math.max(0, post.downvotes - 1);
        }
        
        const { error: updateError } = await supabase
          .from('Posts')
          .update(updates)
          .eq('id', id);
          
        if (updateError) throw updateError;
        
        // Update local state
        setPost({
          ...post,
          ...updates
        });
        setUserVote(null);
      } 
      else {
        // Case 3: Change vote type
        const { error: updateVoteError } = await supabase
          .from('PostVotes')
          .update({ vote_type: voteType })
          .eq('post_id', id)
          .eq('user_email', user.email);
          
        if (updateVoteError) throw updateVoteError;
        
        // Update post vote counts
        const updates = {};
        if (voteType === 'upvote') {
          updates.upvotes = post.upvotes + 1;
          updates.downvotes = Math.max(0, post.downvotes - 1);
        } else {
          updates.downvotes = post.downvotes + 1;
          updates.upvotes = Math.max(0, post.upvotes - 1);
        }
        
        const { error: updateError } = await supabase
          .from('Posts')
          .update(updates)
          .eq('id', id);
          
        if (updateError) throw updateError;
        
        // Update local state
        setPost({
          ...post,
          ...updates
        });
        setUserVote(voteType);
      }
    } catch (error) {
      console.error('Error processing vote:', error);
      setError(`Failed to ${voteType} post: ${error.message}`);
    } finally {
      setVoteLoading(false);
    }
  };
  
  if (loading) {
    return <div>Loading post...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!post) {
    return <div>Post not found!</div>;
  }
  
  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <div className="post-meta">
        <span>Author: {getUsernameFromEmail(post.author)}</span>
        <div className="vote-counts">
          <span className="upvotes-count">👍 {post.upvotes || 0}</span>
          <span className="downvotes-count">👎 {post.downvotes || 0}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.description}</p>
      </div>
      
      <div className="post-actions">
        {user && (
          <div className="vote-buttons">
            <button 
              onClick={() => handleVote('upvote')} 
              className={`vote-btn upvote-btn ${userVote === 'upvote' ? 'active' : ''}`}
              disabled={voteLoading}
            >
              👍 Upvote
            </button>
            <button 
              onClick={() => handleVote('downvote')} 
              className={`vote-btn downvote-btn ${userVote === 'downvote' ? 'active' : ''}`}
              disabled={voteLoading}
            >
              👎 Downvote
            </button>
          </div>
        )}
        
        {user && user.email === post.author && (
          <div className="author-actions">
            <Link to={`/edit-post/${id}`} className="edit-btn">
              Edit
            </Link>
            <button 
              onClick={handleDelete} 
              className="delete-btn"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      
      {/* Add the Comments component */}
      <Comments postId={id} />
    </div>
  );
}

export default PostDetail;