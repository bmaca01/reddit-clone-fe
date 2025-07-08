import React, { useCallback } from 'react';
import {
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
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
  postId,
  postTempId
}) => {
  // Handle comment voting with optimistic UI updates
  const handleCommentVote = useCallback(async (voteType) => {
    if (comment.ui.isPending || comment.ui.isVoting) return;
    
    const previousVote = comment.user_vote;
    let newVote = previousVote === voteType ? null : voteType;
    let newUpvotes = comment.up_votes;
    let newDownvotes = comment.down_votes;

    // Calculate new vote counts optimistically
    if (previousVote === 'up') newUpvotes--;
    if (previousVote === 'down') newDownvotes--;
    if (newVote === 'up') newUpvotes++;
    if (newVote === 'down') newDownvotes++;

    await onVote(
      { 
        postId, 
        postTempId: postTempId,
        tempId: comment.temp_id, 
        commentId: comment.comment_id 
      }, 
      voteType, { upVotes: newUpvotes, dnVotes: newDownvotes }, newVote
    );
  }, [comment, onVote, postId]);

  return (
    <div className={`gap-4 p-4 rounded-xl border transition-shadow duration-200 ${
      comment.ui.isPending 
        ? 'bg-gray-50 border-gray-300 opacity-70' 
        : 'bg-white border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex gap-4 p-r-4 p-y-4">
        {/* Comment Author Avatar */}
        <Avatar className="bg-gradient-to-r from-indigo-500 to-purple-600 w-10 h-10 text-white font-bold shadow-sm">
          {getInitials(comment.author)}
        </Avatar>

        {/* Author Name and Pending Indicator */}
        <div className="flex gap-2">
          <Typography variant="subtitle2" className="font-bold text-gray-800">
            {comment.author.username}
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

        <IconButton>
          <MoreVert />
        </IconButton>

      </div>
      
      <div className="flex p-x-8 p-y-4">
        {/* Comment Content */}

        <div className="flex-grow space-y-2">
          {/* Comment Text */}
          <Typography variant="body2" className="text-gray-700 leading-relaxed">
            {comment.content}
          </Typography>
          
          {/* Comment Vote Error Display */}
          {/** TODO: Implement voteError attribute */}
          {comment.ui.voteError && (
            <Alert severity="error" className="mt-2">
              Failed to vote: {comment.ui.voteError}
            </Alert>
          )}
          
          {/* Comment Voting Section */}
          <VotingSection
            votes={{ up: comment.up_votes, down: comment.down_votes }}
            userVote={comment.user_vote}
            isVoting={comment.ui.isVoting}
            onVote={handleCommentVote}
            error={comment.ui.voteError}
            variant="comment"
            disabled={comment.isPending}
          />
        </div>

      </div>

    </div>
  );
};

export default CommentItem;