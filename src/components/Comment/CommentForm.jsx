import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Avatar,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Send,
  Close
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext'
/**
 * CommentForm - Component for adding new comments to posts
 * 
 * @param {Object} props
 * @param {string} props.postId - ID of the parent post
 * @param {boolean} props.isAddingComment - Whether the form is currently visible
 * @param {string} props.newComment - Current text in the comment input
 * @param {boolean} props.isCommenting - Whether a comment is being submitted
 * @param {string|null} props.error - Error message to display
 * @param {Function} props.onStartComment - Callback to show the comment form
 * @param {Function} props.onUpdateComment - Callback when comment text changes (postId, text) => void
 * @param {Function} props.onCancelComment - Callback to hide the form and clear text
 * @param {Function} props.onAddComment - Callback to submit the comment (postId, content) => void
 */
const CommentForm = ({ 
  post,
  isAddingComment,
  newComment,
  isCommenting,
  error = null,
  onStartComment,
  onUpdateComment,
  onCancelComment,
  onAddComment
}) => {
  const postId = post.temp_id;
  const { user } = useAuth();
  const navigate = useNavigate
  // Handle comment text changes
  const handleTextChange = useCallback((e) => {
    onUpdateComment(postId, e.target.value);
  }, [postId, onUpdateComment]);

  // Handle comment submission
  const handleSubmit = useCallback(async () => {
    if (!newComment.trim() || isCommenting) return;
    await onAddComment(user, post.author.user_id, post.post_id, postId, newComment.trim());
  }, [postId, newComment, isCommenting, onAddComment]);

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    onCancelComment(postId);
  }, [postId, onCancelComment]);

  // Handle showing the comment form
  const handleStartComment = useCallback(() => {
    onStartComment(postId);
  }, [postId, onStartComment]);

  // Handle Enter key submission (Ctrl+Enter or Cmd+Enter)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="border-t border-gray-200">
      {/* Comment Error Display */}
      {error && (
        <Alert severity="error" className="mb-4">
          Failed to add comment: {error}
        </Alert>
      )}

      {/* Comment Form Toggle or Form */}
      {!isAddingComment ? (
        /* Add Comment Trigger */
        <Chip
          icon={<Add />}
          label="Add a comment"
          onClick={() => handleStartComment()}
          className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 border-blue-300 text-blue-700 font-medium"
          variant="outlined"
          color="primary"
          clickable
        />
      ) : (
        /* Comment Form */
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {/* Comment Input Section */}
          <div className="flex gap-4">
            {/* Current User Avatar */}
            <Avatar />

            {/* Comment Text Input */}
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              size="small"
              autoFocus
              disabled={isCommenting}
              className="flex-grow"
              helperText={
                <span className="text-xs text-gray-500">
                  Press Ctrl+Enter to submit
                </span>
              }
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 ml-14">
            <Button
              onClick={handleCancel}
              startIcon={<Close />}
              disabled={isCommenting}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!newComment.trim() || isCommenting}
              startIcon={isCommenting ? <CircularProgress size={16} /> : <Send />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            >
              {isCommenting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentForm;