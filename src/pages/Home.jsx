import { useState, useEffect, useReducer, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import Post from '../components/Post'
import api from '../utils/api'
import axios from 'axios'

// Posts reducer for complex state management
const postsReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_POSTS':
      return action.posts.reduce((acc, post) => ({
        ...acc,
        [post.post_id]: {
          ...post,
          votes: { up: post.up_votes || 0, down: post.down_votes || 0 },
          userVote: post.user_vote || null,
          comments: post.comments || [],
          ui: {
            commentsExpanded: false,
            isVoting: false,
            isCommenting: false,
            isAddingComment: false,
            newComment: '',
            errors: {}
          }
        }
      }), {});

    case 'START_VOTE':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { ...state[action.postId].ui, isVoting: true }
        }
      };

    case 'UPDATE_POST_VOTES':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          votes: action.votes,
          userVote: action.userVote,
          ui: { 
            ...state[action.postId].ui, 
            isVoting: false,
            errors: { ...state[action.postId].ui.errors, vote: null }
          }
        }
      };

    case 'VOTE_ERROR':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: {
            ...state[action.postId].ui,
            isVoting: false,
            errors: { ...state[action.postId].ui.errors, vote: action.error }
          }
        }
      };

    case 'TOGGLE_COMMENTS':
      console.log(action)
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: {
            ...state[action.postId].ui,
            commentsExpanded: !state[action.postId].ui.commentsExpanded
          }
        }
      };

    case 'START_COMMENT':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { ...state[action.postId].ui, isAddingComment: true }
        }
      };

    case 'UPDATE_COMMENT_TEXT':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { ...state[action.postId].ui, newComment: action.text }
        }
      };

    case 'CANCEL_COMMENT':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { 
            ...state[action.postId].ui, 
            isAddingComment: false, 
            newComment: '',
            errors: { ...state[action.postId].ui.errors, comment: null }
          }
        }
      };

    case 'ADD_COMMENT_OPTIMISTIC':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: [
            ...state[action.postId].comments,
            {
              id: action.tempId,
              author: 'Current User',
              content: action.content,
              upvotes: 0,
              downvotes: 0,
              userVote: null,
              isPending: true
            }
          ],
          ui: {
            ...state[action.postId].ui,
            isCommenting: true,
            newComment: '',
            isAddingComment: false
          }
        }
      };

    case 'COMMENT_SUCCESS':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.map(comment =>
            comment.id === action.tempId 
              ? { ...action.comment, isPending: false }
              : comment
          ),
          ui: {
            ...state[action.postId].ui,
            isCommenting: false,
            errors: { ...state[action.postId].ui.errors, comment: null }
          }
        }
      };

    case 'COMMENT_ERROR':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.filter(
            comment => comment.id !== action.tempId
          ),
          ui: {
            ...state[action.postId].ui,
            isCommenting: false,
            isAddingComment: true,
            newComment: action.originalText,
            errors: { ...state[action.postId].ui.errors, comment: action.error }
          }
        }
      };

    case 'UPDATE_COMMENT_VOTES':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.map(comment =>
            comment.id === action.commentId
              ? { ...comment, upvotes: action.upvotes, downvotes: action.downvotes, userVote: action.userVote }
              : comment
          )
        }
      };

    default:
      return state;
  }
};

function Home() {
  const { user } = useAuth();
  //const [posts, setPosts] = useState([]);
  const [posts, dispatch] = useReducer(postsReducer, {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/social_media');
      //const res = await axios.get('https://jsonplaceholder.typicode.com/posts/');
      console.log(res.data);
      dispatch({ type: 'INITIALIZE_POSTS', posts: res.data.items })
      //setPosts(res.data.items);
    } catch (err) {
      console.log(err);
      setError('Failed to load posts :(');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleVote = useCallback(async (postId, voteType, votes, userVote) => {
    dispatch({ type: 'START_VOTE', postId });
    
    try {
      //await mockApi.vote(postId, voteType);
      await api.post(`/social_media/post/${postId}`, { 'vote': voteType });
      dispatch({ 
        type: 'UPDATE_POST_VOTES', 
        postId, 
        votes, 
        userVote 
      });
    } catch (error) {
      dispatch({ 
        type: 'VOTE_ERROR', 
        postId, 
        error: error.message 
      });
    }
  }, []);

  const handleCommentVote = useCallback(async (postId, commentId, voteType) => {
    // Implement comment voting logic
    try {
      //await mockApi.voteComment(postId, commentId, voteType);
      await api.post(`/social_media/comment/${commentId}`, { 'vote': voteType });

      // Update comment votes in state
      dispatch({
        type: 'UPDATE_COMMENT_VOTES',
        postId,
        commentId,
        // These would be calculated based on current state + vote type
        upvotes: 0,
        downvotes: 0,
        userVote: voteType
      });
    } catch (error) {
      // Handle comment vote error
      console.error('Comment vote failed:', error);
    }
  }, []);

  const handleAddComment = useCallback(async (authorId, postId, content) => {
    const tempId = `temp-${Date.now()}`;
    
    dispatch({ 
      type: 'ADD_COMMENT_OPTIMISTIC', 
      postId, 
      content,
      tempId
    });
    
    try {
      //const newComment = await mockApi.addComment(postId, content);
      const newComment = await api.post(`/social_media/${authorId}/post/${postId}/comment`, {
        'content': content
      });

      dispatch({ 
        type: 'COMMENT_SUCCESS', 
        postId, 
        tempId,
        comment: newComment
      });
    } catch (error) {
      dispatch({ 
        type: 'COMMENT_ERROR', 
        postId, 
        tempId,
        error: error.message,
        originalText: content
      });
    }
  }, []);

  const handleToggleComments = useCallback((postId) => {
    dispatch({ type: 'TOGGLE_COMMENTS', postId });
  }, []);

  const handleStartComment = useCallback((postId) => {
    dispatch({ type: 'START_COMMENT', postId });
  }, []);

  const handleUpdateComment = useCallback((postId, text) => {
    dispatch({ type: 'UPDATE_COMMENT_TEXT', postId, text });
  }, []);

  const handleCancelComment = useCallback((postId) => {
    dispatch({ type: 'CANCEL_COMMENT', postId });
  }, []);

  // Memoized posts array to prevent unnecessary re-renders
  const postsArray = useMemo(() => 
    Object.values(posts).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [posts]
  ); 

  const passedProps = {
    'onVote': handleVote,
    'onCommentVote': handleCommentVote,
    'onAddComment': handleAddComment,
    'onToggleComments': handleToggleComments,
    'onStartComment': handleStartComment,
    'onUpdateComment': handleUpdateComment,
    'onCancelComment': handleCancelComment,

  }

  return (
    <Container className="mt-12">
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        postsArray.map(post => (
          <div key={post.post_id} className="pt-4">
            {console.log(post)}
            <Post 
              post={post}
              onVote={handleVote}
              onCommentVote={handleCommentVote}
              onAddComment={handleAddComment}
              onToggleComments={handleToggleComments}
              onStartComment={handleStartComment}
              onUpdateComment={handleUpdateComment}
              onCancelComment={handleCancelComment}
            />
          </div>
          /**
            <Post { ...{...post, ...passedProps} } />
           * 
           */
        ))
      )}
    </Container>
  );
};

export default Home;