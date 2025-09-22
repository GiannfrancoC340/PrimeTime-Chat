import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useAuth } from '../Context/AuthContext';
import { getUsernameFromEmail } from '../utils'; // Make sure the path is correct
import './Comments.css';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // Default sorting order
  const { user } = useAuth();
  
  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("Fetching comments for post:", postId);
        
        // Determine sort order direction
        const ascending = sortOrder === 'oldest';
        
        const { data, error } = await supabase
          .from('Comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending });
          
        console.log("Comments response:", { data, error });
        
        if (error) throw error;
        
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
    
    // Set up real-time subscription for new comments
    const subscription = supabase
      .channel('public:Comments')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'Comments',
        filter: `post_id=eq.${postId}`
      }, (payload) => {
        console.log("Real-time update received:", payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          setComments(prev => {
            const newComments = [...prev, payload.new];
            return sortComments(newComments, sortOrder);
          });
        } else if (payload.eventType === 'UPDATE') {
          setComments(prev => prev.map(comment => 
            comment.id === payload.new.id ? payload.new : comment
          ));
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => prev.filter(comment => 
            comment.id !== payload.old.id
          ));
        }
      })
      .subscribe();
    
    console.log("Subscription set up for comments on post:", postId);
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [postId, sortOrder]); // Re-fetch when sort order changes
  
  // Sort comments based on selected order
  const sortComments = (commentsArray, order) => {
    const sortedComments = [...commentsArray];
    
    if (order === 'newest') {
      // Sort by newest first
      return sortedComments.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
    } else {
      // Sort by oldest first
      return sortedComments.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
    }
  };
  
  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  
  // Organize comments into a hierarchical structure
  const organizeComments = (commentsArray) => {
    const commentMap = {};
    const rootComments = [];
    
    // First, create a map of comments by ID
    commentsArray.forEach(comment => {
      // Make sure each comment has a replies array
      comment.replies = [];
      commentMap[comment.id] = comment;
    });
    
    // Then, organize comments into a tree structure
    commentsArray.forEach(comment => {
      if (comment.parent_id) {
        // This is a reply, add it to its parent's replies array
        const parent = commentMap[comment.parent_id];
        if (parent) {
          parent.replies.push(comment);
        } else {
          // If parent doesn't exist (shouldn't happen), treat as root comment
          rootComments.push(comment);
        }
      } else {
        // This is a root comment
        rootComments.push(comment);
      }
    });
    
    return rootComments;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle adding a new top-level comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // Redirect to login or show message
      setError('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting new comment for post:", postId);
      
      const { data, error } = await supabase
        .from('Comments')
        .insert([{
          post_id: postId,
          user_email: user.email,
          content: newComment.trim(),
          parent_id: null // Explicitly mark as top-level comment
        }]);
        
      console.log("Comment submission response:", { data, error });
        
      if (error) throw error;
      
      // Clear input after successful submission
      setNewComment('');
      console.log("Comment added successfully");
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Start replying to a comment
  const startReplying = (commentId) => {
    setReplyingToId(commentId);
    setReplyContent('');
    
    // Cancel editing if it was in progress
    setEditingCommentId(null);
    setEditContent('');
  };
  
  // Cancel replying
  const cancelReply = () => {
    setReplyingToId(null);
    setReplyContent('');
  };
  
  // Submit a reply
  const submitReply = async (parentId) => {
    if (!user) {
      setError('You must be logged in to reply');
      return;
    }
    
    if (!replyContent.trim()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting reply to comment:", parentId);
      
      const { data, error } = await supabase
        .from('Comments')
        .insert([{
          post_id: postId,
          user_email: user.email,
          content: replyContent.trim(),
          parent_id: parentId // Set the parent_id to create a nested reply
        }]);
        
      console.log("Reply submission response:", { data, error });
        
      if (error) throw error;
      
      // Clear input and exit reply mode after successful submission
      setReplyContent('');
      setReplyingToId(null);
      console.log("Reply added successfully");
    } catch (error) {
      console.error('Error adding reply:', error);
      setError('Failed to add reply: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Start editing a comment
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    
    // Cancel replying if it was in progress
    setReplyingToId(null);
    setReplyContent('');
  };
  
  // Cancel editing a comment
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  };
  
  // Save edited comment
  const saveEdit = async (commentId) => {
    if (!editContent.trim()) {
      return;
    }
    
    try {
      console.log("Saving edited comment:", commentId);
      
      const { error } = await supabase
        .from('Comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);
        
      console.log("Edit response:", { error });
        
      if (error) throw error;
      
      // Exit edit mode
      setEditingCommentId(null);
      setEditContent('');
      console.log("Comment updated successfully");
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment: ' + error.message);
    }
  };
  
  // Handle deleting a comment
  const handleDelete = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment? This will also delete all replies.')) return;
    
    try {
      console.log("Deleting comment:", commentId);
      
      const { error } = await supabase
        .from('Comments')
        .delete()
        .eq('id', commentId);
        
      console.log("Delete response:", { error });
        
      if (error) throw error;
      
      console.log("Comment deleted successfully");
      // Comment will be removed via the real-time subscription
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment: ' + error.message);
    }
  };
  
  // Render reply form
  const renderReplyForm = (parentId) => (
    <div className="reply-form">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write your reply..."
        rows="3"
      />
      <div className="reply-actions">
        <button 
          onClick={() => submitReply(parentId)} 
          className="submit-reply-btn"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post Reply'}
        </button>
        <button 
          onClick={cancelReply} 
          className="cancel-reply-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  
  // Render edit form for a comment
  const renderEditForm = (comment) => (
    <div className="edit-comment-form">
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        rows="3"
      />
      <div className="edit-actions">
        <button 
          onClick={() => saveEdit(comment.id)} 
          className="save-edit-btn"
        >
          Save
        </button>
        <button 
          onClick={cancelEditing} 
          className="cancel-edit-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  
  // Recursive function to render comments and their replies
  const renderCommentTree = (comment, depth = 0) => {
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToId === comment.id;
    const isAuthor = user && user.email === comment.user_email;
    const hasReplies = comment.replies && comment.replies.length > 0;
    
    return (
      <div 
        key={comment.id} 
        className={`comment-card ${depth > 0 ? `reply-level-${Math.min(depth, 5)}` : ''}`}
      >
        <div className="comment-header">
          <span className="comment-author">{getUsernameFromEmail(comment.user_email)}</span>
          <span className="comment-date">{formatDate(comment.created_at)}</span>
        </div>
        
        {isEditing ? (
          renderEditForm(comment)
        ) : (
          <>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-actions">
              {user && !isReplying && (
                <button 
                  onClick={() => startReplying(comment.id)} 
                  className="reply-btn"
                >
                  Reply
                </button>
              )}
              {isAuthor && !isReplying && (
                <>
                  <button 
                    onClick={() => startEditing(comment)} 
                    className="edit-comment-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(comment.id)} 
                    className="delete-comment-btn"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
        
        {isReplying && renderReplyForm(comment.id)}
        
        {hasReplies && (
          <div className="comment-replies">
            {comment.replies.map(reply => renderCommentTree(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }
  
  // Organize comments into a hierarchical structure
  const rootComments = organizeComments(comments);
  
  // Count total comments (including replies)
  const totalComments = comments.length;
  
  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3 className="comments-title">Comments ({totalComments})</h3>
        
        {/* Sort options */}
        <div className="comments-sort">
          <label htmlFor="comment-sort">Sort by: </label>
          <select 
            id="comment-sort" 
            value={sortOrder} 
            onChange={handleSortChange}
            className="comment-sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-group">
            <label htmlFor="comment">Add a comment:</label>
            <textarea 
              id="comment"
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows="3"
              required
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          Please <a href="/login">log in</a> to leave a comment.
        </p>
      )}
      
      <div className="comments-list">
        {rootComments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          rootComments.map(comment => renderCommentTree(comment))
        )}
      </div>
    </div>
  );
}

export default Comments;