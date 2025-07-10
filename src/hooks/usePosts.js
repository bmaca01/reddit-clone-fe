import { useReducer, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import postsReducer from '../reducers/postReducer'
import api from '../utils/api';

export const usePosts = () => {
  const [posts, dispatch] = useReducer(postsReducer, {});

  // Memoized callbacks to prevent unnecessary re-renders
  const handleVote = useCallback(async (postId, tempId, voteType, votes, userVote) => {
    dispatch({ type: 'START_VOTE', postId: tempId });
    try {
      await api.post(`/social_media/post/${postId}`, { 'vote': voteType });
      dispatch({ 
        type: 'UPDATE_POST_VOTES', 
        postId: tempId, 
        votes, 
        userVote 
      });
    } catch (error) {
      dispatch({ 
        type: 'VOTE_ERROR', 
        postId: tempId, 
        error: error.message 
      });
    }
  }, []);

  const handleCommentVote = useCallback(async (ids, voteType, votes, userVote) => {
    // Implement comment voting logic
    dispatch({ type: 'START_COMMENT_VOTE', postId: ids.postTempId, tempId: ids.tempId })
    try {
      //await mockApi.voteComment(postId, commentId, voteType);
      await api.post(`/social_media/comment/${ids.commentId}`, { 'vote': voteType });

      //console.log(`Comment ${commentId} has ${upVotes} up-votes and ${dnVotes} down-votes`)
      // Update comment votes in state
      dispatch({
        type: 'UPDATE_COMMENT_VOTES',
        // These would be calculated based on current state + vote type
        postId: ids.postTempId,
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
        postId: ids.postTempId,
        tempId: ids.tempId,
        voteError: error.message
      });
    }
  }, []);

  const handleAddComment = useCallback(async (commentAuthor, postAuthorId, postId, postTempId, content) => {
    //const tempId = `temp-${Date.now()}`;
    const tempId = uuidv4();
    
    dispatch({ 
      type: 'ADD_COMMENT_OPTIMISTIC', 
      commentAuthor,
      postId: postTempId, 
      content,
      tempId
    });
    
    try {
      const newComment = await api.post(`/social_media/${postAuthorId}/post/${postId}/comment`, {
        'content': content,
        'temp_id': tempId   // Server sends this back on success as a field in newComment
      });

      //console.log(newComment)

      dispatch({ 
        type: 'COMMENT_SUCCESS', 
        postId: postTempId, 
        tempId,
        comment: newComment.data.comment
      });
    } catch (error) {
      dispatch({ 
        type: 'COMMENT_ERROR', 
        postId: postTempId, 
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

  const handleOpenAddPost = useCallback(() => {
    dispatch({ type: 'OPEN_ADD_POST_MODAL' });
  }, []);

  const handleCloseAddPost = useCallback(() => {
    dispatch({ type: 'CLOSE_ADD_POST_MODAL' });
  }, []);

  const handleFormChange = useCallback((field, value) => {
    dispatch({ type: 'UPDATE_POST_FORM', field, value });
  }, []);

  const handleAddPost = useCallback(async (user, userId, title, content) => {
    //const tempId = `temp-\${Date.now()}`;
    const tempId = uuidv4();
    
    dispatch({ 
      type: 'ADD_POST_OPTIMISTIC', 
      postAuthor: user,
      userId,
      tempId,
      title,
      content
    });
    
    try {
      //const newPost = await mockApi.createPost(title, content);
      console.log(user)
      console.log(userId)
      const newPost = await api.post(`/social_media/${userId}/post`, 
        {
          title: title, 
          content: content,
          temp_id: tempId
        }
      );
      console.log(newPost)
      dispatch({ 
        type: 'ADD_POST_SUCCESS', 
        tempId,
        post: newPost.data.post
      });
      dispatch({ type: 'CLOSE_ADD_POST_MODAL' });
    } catch (error) {
      dispatch({ 
        type: 'ADD_POST_ERROR', 
        tempId,
        error: error.message
      });
    }
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    dispatch({type: 'CLOSE_DELETE_MODAL'})
  })

  const handleDeletePost = useCallback(async (post) => {
    dispatch({ type: 'DELETE_POST_OPTIMISTIC', postId: post.temp_id })
    try {
      const res = await api.delete(`/social_media/post/${post.post_id}`)
      if (res && Object.hasOwn(res.data, 'error')) {
        throw res.data.error;
      }
      console.log(res);
      dispatch({ type: 'DELETE_POST_SUCCESS', postId: post.temp_id })
    } catch (error) {
      console.log(`error thrown: ${error}`)
      dispatch({ type: 'DELETE_POST_ERROR', postId: post.temp_id, error: error.message })
    }
  }, []);

  const handleDeleteComment = useCallback(async (comment) => {
    console.log(comment);
    dispatch({ type: 'DELETE_COMMENT_OPTIMISTIC', postId: comment.postTempId, commentId: comment.temp_id})
    try {
      const res = await api.delete(`/social_media/comment/${comment.comment_id}`)
      if (res && Object.hasOwn(res.data, 'error')) {
        throw res.data.error;
      }
      console.log(res);
      dispatch({ type: 'DELETE_COMMENT_SUCCESS', postId: comment.postTempId, commentId: comment.temp_id })
    } catch (error) {
      console.log(`error thrown: ${error}`)
      dispatch({ type: 'DELETE_COMMENT_ERROR', postId: comment.postTempId, commentId: comment.temp_id, error: error.message })
    }

  }, []);

  const handleEditPost = useCallback(async (user, post) => {

  }, []);

  const handleEditComment = useCallback(async (user, comment) => {

  }, []);

  // Memoized posts array to prevent unnecessary re-renders
  const data = new Object(posts.data);
  const postsArray = useMemo(() => 
    Object.values(data).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [data]
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
    handleOpenAddPost,
    handleCloseAddPost,
    handleFormChange,
    handleAddPost,
    handleCloseDeleteModal,
    handleDeletePost,
    handleDeleteComment,
    handleEditPost,
    handleEditComment,
    dispatch
  };
};