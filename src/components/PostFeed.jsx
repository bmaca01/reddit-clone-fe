import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  Menu,
  MenuItem
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

import { usePosts } from '../hooks/usePosts';
import api from '../utils/api';

import PostComponent from './Post/PostComponent';
import AddPostFab from './Post/AddPostFab';
import AddPostModal from './Post/AddPostForm';
import DeleteDialog from './Post/DeleteDialog';

const PostsFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('topVotes');
  const [deletedItem, setDeletedItem] = useState(null);

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
    handleCloseDeleteModal,
    handleAddPost,
    handleDeletePost,
    handleDeleteComment,
    handleEditPost,
    handleEditComment,
    //handleChangeSort,
    dispatch,
  } = usePosts();

  useEffect(() => {
    const initializePosts = async () => {
      let endPt = '/social_media'
      let query = '';
      switch (sortBy) {
        case 'topVotes':
          query = '?sort_by=total_votes';
          break;
        case 'upVotes':
          query = '?sort_by=upvotes_cnt';
          break;
        case 'downVotes':
          query = '?sort_by=dnvotes_cnt';
          break;
        case 'latest':
          query = '?sort_by=created_at';
          break;
        case 'oldest':
          query = '?sort_by=created_at&order=asc';
          break;
        default:
          break;
      }
      endPt += query;
      try {
        const res = await api.get(endPt);
        dispatch({ type: 'INITIALIZE_POSTS', posts: res.data.items });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load posts');
        setIsLoading(false);
      }
    };

    initializePosts();
  }, [dispatch, sortBy]);

  const onDelete = useCallback(async (itemType, it) => {
    // Wraps handleDeletePost and handleDeleteComment
    // Extracts the requested post / comment id to pass to delete modal.
    // Passed to props
    //console.log(it)

    setDeletedItem(
      {
        itemType,
        item: it
      })

    dispatch({type: 'OPEN_DELETE_MODAL'})
  }, []);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

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
      <Box className="max-w-48 flex place-content-center mx-8 gap-2">
        <Typography variant="body2" >
          Sorted by:
        </Typography>
        <FormControl
          size="small"
        >
          <InputLabel>Sort by...</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleChange}
          >
            <MenuItem value="topVotes">Top votes</MenuItem>
            <MenuItem value="upVotes">Most up-votes</MenuItem>
            <MenuItem value="downVotes">Most down-votes</MenuItem>
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </Box>
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
          onDeletePost={onDelete}
          onDeleteComment={onDelete}
          onEditPost={handleEditPost}
          onEditComment={handleEditComment}
        />
      ))}

      {/* Add the modal and FAB */}
      <AddPostModal
        isOpen={posts.ui?.addPostModal?.isOpen || false}
        onClose={handleCloseAddPost}
        onSubmit={handleAddPost}
        formData={posts.ui?.addPostModal?.form || { title: '', content: '' }}
        onFormChange={handleFormChange}
        isSubmitting={posts.ui?.addPostModal?.form?.isSubmitting || false}
        errors={posts.ui?.addPostModal?.form?.errors || {}}
      />

      <DeleteDialog
        isOpen={posts.ui?.deleteModal?.isOpen || false}
        onClose={handleCloseDeleteModal}
        item={deletedItem}
        onDeletePost={handleDeletePost}
        onDeleteComment={handleDeleteComment}
      />

      <AddPostFab onClick={handleOpenAddPost} />
    </Container>
  );
};

export default PostsFeed;
