import { useReducer, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import postsReducer from '../reducers/postReducer'
import api from '../utils/api';

export const usePosts = () => {
  const [posts, dispatch] = useReducer(postsReducer, {});

  // Memoized callbacks to prevent unnecessary re-renders
  const handleVote = useCallback(async (postId, voteType, votes, userVote) => {
    dispatch({ type: 'START_VOTE', postId });
    try {
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

  const handleCommentVote = useCallback(async (ids, voteType, votes, userVote) => {
    // Implement comment voting logic
    dispatch({ type: 'START_COMMENT_VOTE', postId: ids.postId, tempId: ids.tempId })
    try {
      //await mockApi.voteComment(postId, commentId, voteType);
      await api.post(`/social_media/comment/${ids.commentId}`, { 'vote': voteType });

      //console.log(`Comment ${commentId} has ${upVotes} up-votes and ${dnVotes} down-votes`)
      // Update comment votes in state
      dispatch({
        type: 'UPDATE_COMMENT_VOTES',
        // These would be calculated based on current state + vote type
        postId: ids.postId,
        tempId: ids.tempId,
        upvotes: votes.upVotes,
        downvotes: votes.dnVotes,
        userVote: userVote
      });
    } catch (error) {
      // Handle comment vote error
      console.error('Comment vote failed:', error);
      dispatch({
        type: 'COMMENT_VOTE_ERROR',
        postId: ids.postId,
        tempId: ids.tempId,
        voteError: error.message
      });
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
    Object.values(posts).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [posts]
  ); 

  return {
    posts,
    postsArray,
    handleVote,
    handleCommentVote,
    handleAddComment,
    handleToggleComments,
    handleStartComment,
    handleUpdateComment,
    handleCancelComment,
    dispatch
  };
};