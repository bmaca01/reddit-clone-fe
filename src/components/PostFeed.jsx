import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

import { usePosts } from '../hooks/usePosts';
import api from '../utils/api';

import PostComponent from './Post/PostComponent';
import AddPostFab from './Post/AddPostFab';
import AddPostModal from './Post/AddPostForm';

const PostsFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
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
    dispatch,
  } = usePosts();

  useEffect(() => {
    const initializePosts = async () => {
      try {
        const res = await api.get('/social_media');
        dispatch({ type: 'INITIALIZE_POSTS', posts: res.data.items });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load posts');
        setIsLoading(false);
      }
    };

    initializePosts();
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container maxWidth="md" className="py-8">
        <div className="flex justify-center items-center h-64">
          <CircularProgress size={48} />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className="py-8">
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography
        variant="h3"
        component="h1"
        className="text-center mb-8 font-bold text-gray-800"
      >
        Social Posts Feed
      </Typography>

      <Typography variant="body1" className="text-center mb-8 text-gray-600">
        Enhanced with Comment Voting - {postsArray.length} posts loaded
      </Typography>

      {postsArray.map((post) => (
        <PostComponent
          key={post.post_id}
          post={post}
          onVote={handleVote}
          onCommentVote={handleCommentVote}
          onAddComment={handleAddComment}
          onToggleComments={handleToggleComments}
          onStartComment={handleStartComment}
          onUpdateComment={handleUpdateComment}
          onCancelComment={handleCancelComment}
        />
      ))}

      {/* Add the modal and FAB */}
      {console.log(posts)}
      
      <AddPostModal
        isOpen={posts.ui?.addPostModal?.isOpen || false}
        onClose={handleCloseAddPost}
        onSubmit={handleAddPost}
        formData={posts.ui?.addPostModal?.form || { title: '', content: '' }}
        onFormChange={handleFormChange}
        isSubmitting={posts.ui?.addPostModal?.form?.isSubmitting || false}
        errors={posts.ui?.addPostModal?.form?.errors || {}}
      />
      
      <AddPostFab onClick={handleOpenAddPost} />
    </Container>
  );
};

export default PostsFeed;
