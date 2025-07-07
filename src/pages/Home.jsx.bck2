import { useState, useEffect, useReducer, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../contexts/AuthContext'
//import Post from '../components/Post'
import PostComponent from '../components/Post/PostComponent'
import api from '../utils/api'
import postsReducer from '../reducers/postReducer'
//import axios from 'axios'


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

  // TODO: Make this more succinct....
  const handleCommentVote = useCallback(async (postId, tempId, commentId, voteType, upVotes, dnVotes, userVote) => {
    // Implement comment voting logic
    dispatch({ type: 'START_COMMENT_VOTE', postId, tempId})
    try {
      //await mockApi.voteComment(postId, commentId, voteType);
      await api.post(`/social_media/comment/${commentId}`, { 'vote': voteType });

      //console.log(`Comment ${commentId} has ${upVotes} up-votes and ${dnVotes} down-votes`)
      // Update comment votes in state
      dispatch({
        type: 'UPDATE_COMMENT_VOTES',
        postId,
        tempId,
        commentId,
        // These would be calculated based on current state + vote type
        upvotes: upVotes,
        downvotes: dnVotes,
        userVote: userVote
      });
    } catch (error) {
      // Handle comment vote error
      console.error('Comment vote failed:', error);
    }
  }, []);

  const handleAddComment = useCallback(async (commentAuthor, postAuthorId, postId, content) => {
    //const tempId = `temp-${Date.now()}`;
    const tempId = uuidv4();
    
    dispatch({ 
      type: 'ADD_COMMENT_OPTIMISTIC', 
      commentAuthor,
      postId, 
      content,
      tempId
    });
    
    try {
      //const newComment = await mockApi.addComment(postId, content);
      const newComment = await api.post(`/social_media/${postAuthorId}/post/${postId}/comment`, {
        'content': content,
        'temp_id': tempId   // Server sends this back on success as a field in newComment
      });

      dispatch({ 
        type: 'COMMENT_SUCCESS', 
        postId, 
        tempId,
        comment: {...newComment.data.comment}
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

  return (
    <Container className="mt-12">
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        postsArray.map(post => (
          <div key={post.post_id} className="pt-4">
            {/**console.log(post)*/}
            <PostComponent
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