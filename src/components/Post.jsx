import { useState, useEffect, useCallback } from 'react'
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

import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

const formatRelativeTime = (createdAt) => {
  // Handle various input formats
  const createdDate = new Date(createdAt);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(createdDate.getTime())) {
    return 'Unknown time';
  }
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - createdDate.getTime();
  
  // Handle future dates (shouldn't happen but good to check)
  if (diffMs < 0) {
    return 'Just now';
  }
  
  // Convert to different time units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  // Return appropriate format based on time elapsed
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
};

const useRelativeTime = (createdAt, updateInterval = 60000) => {
  const [relativeTime, setRelativeTime] = useState('');
  
  useEffect(() => {
    // Initial calculation
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(createdAt));
    };
    
    updateTime();
    
    // Set up interval for updates
    const interval = setInterval(updateTime, updateInterval);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [createdAt, updateInterval]);
  
  return relativeTime;
};


function Post(props) {
  /**
  const { 
    author,
    post_id, 
    user_id,
    title, 
    content, 
    up_votes, 
    down_votes, 
    user_vote,
    total_votes,
    created_at, 
    updated_at,
    onVote,
    onCommentVote,
    onAddComment,
    onToggleComments,
    onStartComment,
    onUpdateComment,
    onCancelComment
  } = props;
   */
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
  const [postUserVote, setPostUserVote] = useState(null);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  //const [comments, setComments] = useState([]);

  const navigate = useNavigate()
  const relTime = useRelativeTime(created_at)

  const handleVote = useCallback(async (voteType) => {
    if (post.ui.isVoting) return;
    
    const previousVote = post.userVote;
    let newVote = previousVote === voteType ? null : voteType;
    let newUpvotes = post.votes.up;
    let newDownvotes = post.votes.down;

    // Calculate new vote counts
    if (previousVote === 'up') newUpvotes--;
    if (previousVote === 'down') newDownvotes--;
    if (newVote === 'up') newUpvotes++;
    if (newVote === 'down') newDownvotes++;

    await onVote(post.post_id, voteType, {
      up: newUpvotes,
      down: newDownvotes
    }, newVote);
  }, [post, onVote]);

  const handleAddComment = useCallback(async () => {
    if (!post.ui.newComment.trim() || post.ui.isCommenting) return;
    await onAddComment(post.post_id, post.ui.newComment.trim());
  }, [post, onAddComment]);

  //useEffect(() => {
  //  if (user) {
  //    console.log("There's a user");
  //    setPostUserVote(user_vote)
  //  } else {
  //    console.log("no user");
  //  }
  //  return;
  //}, []);

  //useEffect(() => {}, [postUserVote]);

  /**
  const handlePostVote = async (dir) => {
    try {
      const res = await api.post(
        `/social_media/post/${post_id}`, 
        { vote: dir }
      );
      u_votes = res.up_votes;
      d_votes = res.down_votes;
    } catch (err) {
      console.log(err);
    } 
    if (postUserVote === dir) {
      setPostUserVote(null);
    } else {
      setPostUserVote(dir);
    }
    return;
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(), // Simple ID generation
        author: 'Current User', // In real app, this would come from auth
        content: newComment.trim(),
        upvotes: 0,
        downvotes: 0,
        userVote: null
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  const handleCancelComment = () => {
    setNewComment('');
    setIsAddingComment(false);
  };
   * 
   */

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
        {/**
        <Box className="flex items-center gap-2 mt-6">
          <IconButton
            onClick={() => {user ? handlePostVote('up') : navigate('/login')}}
            className={`${postUserVote === 'up' ? 'text-green-600 bg-green-100' : 'text-gray-600'} hover:bg-green-50`}
            size="small"
          >
            <ThumbUp fontSize="small" />
          </IconButton>
          <Typography>{up_votes - down_votes}</Typography>
          <IconButton
            onClick={() => {user ? handlePostVote('down') : navigate('/login')}}
            className={`${postUserVote === 'down' ? 'text-red-600 bg-red-100' : 'text-gray-600'} hover:bg-red-50`}
            size="small"
          >
            <ThumbDown fontSize="small" />
          </IconButton>
        </Box>
         * 
         */}
        <Box className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => handleVote('up')}
              disabled={post.ui.isVoting}
              className={`transition-all duration-200 hover:scale-110 ${
                post.userVote === 'up' 
                  ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
              }`}
              size="small"
            >
              {post.ui.isVoting ? (
                <CircularProgress size={20} className="text-green-600" />
              ) : (
                <ThumbUp fontSize="small" />
              )}
            </IconButton>
            <Typography variant="body2" className="font-semibold text-gray-700 min-w-[2rem] text-center">
              {post.votes.up}
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => handleVote('down')}
              disabled={post.ui.isVoting}
              className={`transition-all duration-200 hover:scale-110 ${
                post.userVote === 'down' 
                  ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
              size="small"
            >
              {post.ui.isVoting ? (
                <CircularProgress size={20} className="text-red-600" />
              ) : (
                <ThumbDown fontSize="small" />
              )}
            </IconButton>
            <Typography variant="body2" className="font-semibold text-gray-700 min-w-[2rem] text-center">
              {post.votes.down}
            </Typography>
          </div>
        </Box>


        <Divider className="py-2"/>

        {/* Comments Toggle */}
        <Box className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <CommentIcon className="text-blue-600" fontSize="small" />
            <Typography variant="body2" className="font-semibold text-blue-800">
              {post.comments.length} Comments
            </Typography>
          </div>
          
          <IconButton
            onClick={() => onToggleComments(post.post_id)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200"
            size="small"
          >
            {post.ui.commentsExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Comments Section */}
        <Collapse in={post.ui.commentsExpanded} timeout="auto" unmountOnExit>
          <div className="mt-6 space-y-4">
            {/* Comment Error Display */}
            {post.ui.errors.comment && (
              <Alert severity="error">
                Failed to add comment: {post.ui.errors.comment}
              </Alert>
            )}

            {/* Add Comment Section */}
            <div className="pt-6 border-t border-gray-200">
              {!post.ui.isAddingComment ? (
                <Chip
                  icon={<Add />}
                  label="Add a comment"
                  onClick={() => onStartComment(post.post_id)}
                  className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 border-blue-300 text-blue-700 font-medium"
                  variant="outlined"
                  color="primary"
                  clickable
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex gap-4">
                    <Avatar className="bg-gradient-to-r from-purple-500 to-pink-600 w-10 h-10 text-white font-bold shadow-sm">
                      CU
                    </Avatar>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Write a comment..."
                      value={post.ui.newComment}
                      onChange={(e) => onUpdateComment(post.post_id, e.target.value)}
                      variant="outlined"
                      size="small"
                      autoFocus
                      disabled={post.ui.isCommenting}
                      className="flex-grow"
                    />
                  </div>
                  <div className="flex justify-end gap-2 ml-14">
                    <Button
                      onClick={() => onCancelComment(post.post_id)}
                      startIcon={<Close />}
                      disabled={post.ui.isCommenting}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                      color="inherit"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddComment}
                      variant="contained"
                      disabled={!post.ui.newComment.trim() || post.ui.isCommenting}
                      startIcon={post.ui.isCommenting ? <CircularProgress size={16} /> : <Send />}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                    >
                      {post.ui.isCommenting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Comments */}
            <div className="space-y-6">
              {post.comments.map((comment, index) => (
                <div key={comment.comment_id} className="space-y-4">
                  <div className={`flex gap-4 p-4 rounded-xl border transition-shadow duration-200 ${
                    comment.isPending 
                      ? 'bg-gray-50 border-gray-300 opacity-70' 
                      : 'bg-white border-gray-200 hover:shadow-md'
                  }`}>
                    <Avatar className="bg-gradient-to-r from-indigo-500 to-purple-600 w-10 h-10 text-white font-bold shadow-sm">
                      {getInitials(comment.author)}
                    </Avatar>
                    
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                        <Typography variant="subtitle2" className="font-bold text-gray-800">
                          {comment.author}
                        </Typography>
                        {comment.isPending && (
                          <CircularProgress size={12} className="text-gray-400" />
                        )}
                      </div>
                      <Typography variant="body2" className="text-gray-700 leading-relaxed">
                        {comment.content}
                      </Typography>
                      
                      {/* Comment Voting */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-1">
                          <IconButton
                            onClick={() => onCommentVote(post.post_id, comment.comment_id, 'up')}
                            disabled={comment.isPending}
                            className={`transition-all duration-200 hover:scale-110 ${
                              comment.userVote === 'up' 
                                ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            size="small"
                          >
                            <ThumbUp fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" className="font-medium text-gray-600 min-w-[1.5rem] text-center">
                            {comment.upvotes}
                          </Typography>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <IconButton
                            onClick={() => onCommentVote(post.post_id, comment.comment_id, 'down')}
                            disabled={comment.isPending}
                            className={`transition-all duration-200 hover:scale-110 ${
                              comment.userVote === 'down' 
                                ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                            size="small"
                          >
                            <ThumbDown fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" className="font-medium text-gray-600 min-w-[1.5rem] text-center">
                            {comment.downvotes}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < post.comments.length - 1 && (
                    <Divider className="border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Collapse>

        {/* Comments Toggle */}
        {/**
        <Box className="flex items-center justify-between pt-4">
          <Box className="flex items-center gap-2">
            <CommentIcon className="text-gray-600" fontSize="small" />
            <Typography variant="body2" className="text-gray-700 font-medium">
              {comments.length} Comments
            </Typography>
          </Box>
          
          <IconButton
            onClick={() => setCommentsExpanded(!commentsExpanded)}
            className="text-gray-600 hover:bg-gray-50"
            size="small"
          >
            {commentsExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
         */}

        {/* Comments Section */}
        {/**
        <Collapse in={commentsExpanded} timeout="auto" unmountOnExit>
          <Box className="mt-4">
            {/* Add Comment Section *\/}
            <div className="pt-6 border-t border-gray-200">
              {!isAddingComment ? (
                <Chip
                  icon={<Add />}
                  label="Add a comment"
                  onClick={() => setIsAddingComment(true)}
                  className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 border-blue-300 text-blue-700 font-medium"
                  variant="outlined"
                  color="primary"
                  clickable
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex gap-4">
                    <Avatar className="bg-gradient-to-r from-purple-500 to-pink-600 w-10 h-10 text-white font-bold shadow-sm">
                      CU
                    </Avatar>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      variant="outlined"
                      size="small"
                      autoFocus
                      className="flex-grow"
                      InputProps={{
                        className: "bg-white border-gray-300 focus:border-blue-500 rounded-lg"
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2 ml-14">
                    <Button
                      onClick={handleCancelComment}
                      startIcon={<Close />}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                      color="inherit"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddComment}
                      variant="contained"
                      disabled={!newComment.trim()}
                      startIcon={<Send />}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {comments.map((comment, index) => (
              <Box key={comment.id} className="mb-4">
                <Box className="flex gap-3">
                  <Avatar className="bg-purple-500" sx={{ width: 32, height: 32 }}>
                    {getInitials(comment.author)}
                  </Avatar>
                  
                  <Box className="flex-1">
                    <Typography variant="subtitle2" className="font-semibold text-gray-800 mb-1">
                      {comment.author}
                    </Typography>
                    <Typography variant="body2" className="text-gray-700 mb-2">
                      {comment.content}
                    </Typography>
                    
                    {/* Comment Voting *\/}
                    <Box className="flex items-center gap-1">
                      <IconButton
                        onClick={() => handleCommentVote(comment.id, 'up')}
                        className={`${comment.userVote === 'up' ? 'text-green-600' : 'text-gray-500'} hover:bg-green-50`}
                        size="small"
                      >
                        <ThumbUp fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" className="text-gray-600 font-medium">
                        {comment.upvotes}
                      </Typography>
                      
                      <IconButton
                        onClick={() => handleCommentVote(comment.id, 'down')}
                        className={`${comment.userVote === 'down' ? 'text-red-600' : 'text-gray-500'} hover:bg-red-50`}
                        size="small"
                      >
                        <ThumbDown fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" className="text-gray-600 font-medium">
                        {comment.downvotes}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {index < comments.length - 1 && <Divider className="mt-3" />}
              </Box>
            ))}
          </Box>
        </Collapse>
         */}

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