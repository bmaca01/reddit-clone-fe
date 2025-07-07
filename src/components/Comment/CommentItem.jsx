import React, { useCallback } from 'react';
import {
  Avatar,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import VotingSection from '../Post/VotingSection';
import { getInitials } from '../../utils/helpers';

/**
 * CommentItem - Individual comment component with voting functionality
 * 
 * @param {Object} props
 * @param {Object} props.comment - Comment data object
 * @param {Function} props.onVote - Callback for voting on comment (commentId, voteType) => void
 * @param {string} props.postId - ID of the parent post
 */
const CommentItem = ({ 
  comment, 
  onVote, 
  postId 
}) => {
  // Handle comment voting with optimistic UI updates
  const handleCommentVote = useCallback(async (voteType) => {
    if (comment.isPending || comment.isVoting) return;
    
    const previousVote = comment.userVote;
    let newVote = previousVote === voteType ? null : voteType;
    let newUpvotes = comment.upvotes;
    let newDownvotes = comment.downvotes;

    // Calculate new vote counts optimistically
    if (previousVote === 'up') newUpvotes--;
    if (previousVote === 'down') newDownvotes--;
    if (newVote === 'up') newUpvotes++;
    if (newVote === 'down') newDownvotes++;

    await onVote(postId, comment.id, voteType, {
      upvotes: newUpvotes,
      downvotes: newDownvotes
    }, newVote);
  }, [comment, onVote, postId]);

  return (
    <div className={`flex gap-4 p-4 rounded-xl border transition-shadow duration-200 ${
      comment.ui.isPending 
        ? 'bg-gray-50 border-gray-300 opacity-70' 
        : 'bg-white border-gray-200 hover:shadow-md'
    }`}>
      {/* Comment Author Avatar */}
      <Avatar className="bg-gradient-to-r from-indigo-500 to-purple-600 w-10 h-10 text-white font-bold shadow-sm">
        {getInitials(comment.author)}
      </Avatar>
      
      {/* Comment Content */}
      <div className="flex-grow space-y-2">
        {/* Author Name and Pending Indicator */}
        <div className="flex items-center gap-2">
          <Typography variant="subtitle2" className="font-bold text-gray-800">
            {comment.author}
          </Typography>
          {comment.ui.isPending && (
            <div className="flex items-center gap-1">
              <CircularProgress size={12} className="text-gray-400" />
              <Typography variant="caption" className="text-gray-500">
                Posting...
              </Typography>
            </div>
          )}
        </div>

        {/* Comment Text */}
        <Typography variant="body2" className="text-gray-700 leading-relaxed">
          {comment.content}
        </Typography>
        
        {/* Comment Vote Error Display */}
        {comment.voteError && (
          <Alert severity="error" className="mt-2">
            Failed to vote: {comment.voteError}
          </Alert>
        )}
        
        {/* Comment Voting Section */}
        <VotingSection
          votes={{ up: comment.up_votes, down: comment.down_votes }}
          userVote={comment.user_vote}
          isVoting={comment.ui.isVoting}
          onVote={handleCommentVote}
          error={comment.voteError}
          variant="comment"
          disabled={comment.isPending}
        />
      </div>
    </div>
  );
};

export default CommentItem;