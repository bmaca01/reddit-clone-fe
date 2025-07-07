import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'

import { 
  Paper, 
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box, 
  Container, 
  Typography, 
  Divider,
  IconButton,
  Collapse,
  Avatar,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'

import { 
  ArrowCircleDown, 
  ArrowCircleDownTwoTone, 
  ArrowCircleUp, 
  ArrowCircleUpTwoTone,
  ThumbUp,
  ThumbDown,
  ExpandMore,
  ExpandLess,
  Comment as CommentIcon,
  Add,
  Send,
  Close
} from '@mui/icons-material'

import VotingSection from './Post/VotingSection'
//import CommentItem from './Comment/CommentItem'
import CommentsSection from './Comment/CommentsSection'

import { useAuth } from '../contexts/AuthContext'
import useRelativeTime from '../hooks/useRelativeTime'
import { getInitials } from '../utils/helpers'
import api from '../utils/api'

function Post(props) {
  const {
    post,
    onVote,
    onCommentVote,
    onAddComment,
    onToggleComments,
    onStartComment,
    onUpdateComment,
    onCancelComment
  } = props;

  const {
    author,
    comments,
    content,
    created_at,
    down_votes,
    post_id,
    title,
    total_votes,
    ui,
    up_votes,
    updated_at,
    userVote,
    user_id,
    user_vote,
    votes
  } = post;

  const { user } = useAuth();

  const navigate = useNavigate()
  const relTime = useRelativeTime(created_at)

  const handleVote = useCallback(async (voteType) => {
    if (!user) navigate('/login');
    if (post.ui.isVoting) return;
    
    const previousVote = post.userVote;
    let newVote = previousVote === voteType ? null : voteType;
    let newUpvotes = post.votes.up;
    let newDownvotes = post.votes.down;

    if (previousVote === 'up') newUpvotes--;
    if (previousVote === 'down') newDownvotes--;
    if (newVote === 'up') newUpvotes++;
    if (newVote === 'down') newDownvotes++;

    await onVote(post.post_id, voteType, {
      up: newUpvotes,
      down: newDownvotes
    }, newVote);
  }, [post, onVote]);

  const handleCommentVote = useCallback(async (voteType, comment) => {
    console.log(voteType);
    console.log(comment);
    if (!user) navigate('/login');
    if (comment.ui.isVoting) return;

    const previousVote = comment.user_vote;
    let newVote = previousVote === voteType ? null : voteType;
    let newUpvotes = comment.up_votes;
    let newDownvotes = comment.down_votes;

    if (previousVote === 'up') newUpvotes--;
    if (previousVote === 'down') newDownvotes--;
    if (newVote === 'up') newUpvotes++;
    if (newVote === 'down') newDownvotes++;


    await onCommentVote(post.post_id, comment.temp_id, comment.comment_id, voteType, newUpvotes, newDownvotes, newVote);
  }, [post, onCommentVote])

  const handleAddComment = useCallback(async () => {
    if (!post.ui.newComment.trim() || post.ui.isCommenting) return;
    await onAddComment(user, post.user_id, post.post_id, post.ui.newComment.trim());
  }, [post, onAddComment]);

  const commentsArray = useMemo(() =>
    Object.values(comments).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [comments]
  );

  return (
    <Card className="p-4">
      <CardHeader 
        avatar={
          <Avatar 
            sx={{ width: 56, height: 56 }}
          />
        }
        title={
          <Typography variant="h3" className="font-bold text-gray-80">
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="subtitle2">
            {author.username}, posted {relTime}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Typography variant="body1" className="mb-4 leading-relaxed">
          {content}
        </Typography>

        {/* Voting Section */}
        <VotingSection
          votes={post.votes}
          userVote={post.userVote}
          isVoting={post.ui.isVoting}
          onVote={handleVote}
          variant='post'
          disabled={post.ui.isVoting}
        />

        <Divider className="py-2"/>

        {/* Comments Section */}
        <CommentsSection 
          post={post}
          commentsArray={commentsArray}
          onCommentVote={onCommentVote}       // Called in CommentItem
          onAddComment={onAddComment}         // Called in CommentForm
          onToggleComments={onToggleComments} // Called in CommentsSection
          onStartComment={onStartComment}     // Called in CommentForm
          onUpdateComment={onUpdateComment}   // Called in CommentForm
          onCancelComment={onCancelComment}   // Called in CommentForm
        />
      </CardContent>

      <CardActions>

      </CardActions>
    </Card>

  )

  /**
  return (
    <Box>
      <Paper className="p-8 m-8">
        <Box className="flex gap-8">
          <Box className="flex items-center gap-x-4">
            <IconButton>
              <ArrowCircleUp fontSize="large" />
            </IconButton>
            <Typography>{up_votes - down_votes}</Typography>
            <IconButton>
              <ArrowCircleDown fontSize="large" />
            </IconButton>
          </Box>
          <Typography variant="caption">
            Created At: {created_at} <br />
            Last Update: {updated_at}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" className="px-2">
            Author: {author.username}
          </Typography>

        </Box>
        <Typography variant="h3" className="px-2 pb-5">
          {title}
        </Typography>
        <Divider />
        <Typography variant="body1" className="px-2 py-4">
          {content}
        </Typography>
      </Paper>
    </Box>
  );
   * 
   */

};

export default Post;