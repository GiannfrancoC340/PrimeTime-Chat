import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';
import { useAuth } from '../Context/AuthContext';
import { getUsernameFromEmail } from '../utils'; // Make sure the path is correct
import './posts.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at_desc'); // Default sort by newest
  const [searchTerm, setSearchTerm] = useState('');
  const [commentCounts, setCommentCounts] = useState({});
  const { user } = useAuth();
  
  useEffect(() => {
    // Fetch posts from Supabase
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...");
        
        // Get posts without specific ordering first
        const { data, error } = await supabase
          .from('Posts')
          .select('*');
          
        console.log("Response:", { data, error });
        
        if (error) throw error;
        
        // Store all posts for filtering
        setAllPosts(data || []);
        
        // Apply filtering and sorting
        const filteredAndSortedPosts = filterAndSortPosts(data || [], searchTerm, sortBy);
        setPosts(filteredAndSortedPosts);
        
        // Fetch comment counts for each post
        fetchCommentCounts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [sortBy]); // Re-fetch when sort option changes
  
  // Fetch comment counts for all posts
  const fetchCommentCounts = async (postsData) => {
    try {
      console.log("Fetching comment counts...");
      
      // Get all comments
      const { data: commentsData, error } = await supabase
        .from('Comments')
        .select('post_id');
        
      if (error) throw error;
      
      // Count comments for each post
      const counts = {};
      
      postsData.forEach(post => {
        // Initialize count to 0 for each post
        counts[post.id] = 0;
      });
      
      // Increment count for each comment
      commentsData.forEach(comment => {
        if (counts[comment.post_id] !== undefined) {
          counts[comment.post_id]++;
        }
      });
      
      console.log("Comment counts:", counts);
      setCommentCounts(counts);
    } catch (error) {
      console.error('Error fetching comment counts:', error);
    }
  };
  
  // Apply filtering and sorting when search term changes
  useEffect(() => {
    const filteredAndSortedPosts = filterAndSortPosts(allPosts, searchTerm, sortBy);
    setPosts(filteredAndSortedPosts);
  }, [searchTerm, sortBy, allPosts]);
  
  // Function to filter and sort posts
  const filterAndSortPosts = (posts, search, sortOption) => {
    // First filter by search term (case insensitive)
    let filteredPosts = posts;
    
    if (search.trim() !== '') {
      filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Then sort the filtered posts
    const postsToSort = [...filteredPosts]; // Create a copy to avoid mutating original data
    
    switch (sortOption) {
      case 'created_at_desc': // Newest first
        return postsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'created_at_asc': // Oldest first
        return postsToSort.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'upvotes_desc': // Most upvotes
        return postsToSort.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      case 'upvotes_asc': // Least upvotes
        return postsToSort.sort((a, b) => (a.upvotes || 0) - (b.upvotes || 0));
      case 'title_asc': // A-Z
        return postsToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc': // Z-A
        return postsToSort.sort((a, b) => b.title.localeCompare(a.title));
      case 'comments_desc': // Most comments
        return postsToSort.sort((a, b) => 
          (commentCounts[b.id] || 0) - (commentCounts[a.id] || 0)
        );
      case 'comments_asc': // Least comments
        return postsToSort.sort((a, b) => 
          (commentCounts[a.id] || 0) - (commentCounts[b.id] || 0)
        );
      default:
        return postsToSort;
    }
  };
  
  // Handle sort option change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Function to format the date
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
  
  if (loading) {
    return <div>Loading posts...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Forum Posts</h1>
        
        <div className="controls-container">
          {/* Search input */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Sort dropdown */}
          <div className="sort-container">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select" 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="upvotes_desc">Most Upvotes</option>
              <option value="upvotes_asc">Least Upvotes</option>
              <option value="comments_desc">Most Comments</option>
              <option value="comments_asc">Least Comments</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="no-posts">
          {searchTerm ? (
            <>
              <p>No posts found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} className="clear-search-btn-large">
                Clear Search
              </button>
            </>
          ) : (
            <>
              <p>No posts yet. Be the first to create a post!</p>
              <Link to="/create-post" className="create-post-btn">
                Create Post
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              {user && user.email === post.author && (
                <Link to={`/edit-post/${post.id}`} className="edit-card-btn">
                  ✏️
                </Link>
              )}
              <Link to={`/post/${post.id}`} className="post-title-link">
                <h2>{post.title}</h2>
              </Link>
              
              <div className="post-meta">
                <span>By: {getUsernameFromEmail(post.author)}</span>
                
                <div className="stats-container">
                  <div className="vote-stats">
                    <span className="upvotes">👍 {post.upvotes || 0}</span>
                    {post.downvotes !== undefined && (
                      <span className="downvotes">👎 {post.downvotes || 0}</span>
                    )}
                  </div>
                  
                  <div className="comment-stats">
                    <span className="comment-count">💬 {commentCounts[post.id] || 0}</span>
                  </div>
                </div>
                
                <span className="post-date">
                  Posted: {formatDate(post.created_at)}
                </span>
                
                <Link to={`/post/${post.id}`} className="read-more">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;