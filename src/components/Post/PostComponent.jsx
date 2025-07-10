import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { 
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography, 
  Divider,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material'

import {
  MoreVert
} from '@mui/icons-material'

import VotingSection from './VotingSection'
import CommentsSection from '../Comment/CommentsSection'

import { useAuth } from '../../contexts/AuthContext'
import useRelativeTime from '../../hooks/useRelativeTime'
import { getInitials } from '../../utils/helpers'

function PostComponent(props) {
  //console.log(props);
  const {
    post,
    onVote,
    onCommentVote,
    onAddComment,
    onToggleComments,
    onStartComment,
    onUpdateComment,
    onCancelComment,
    onDeletePost,
    onDeleteComment,
    onEditPost,
    onEditComment
  } = props;

  const {
    author,
    comments,
    content,
    created_at,
    down_votes,
    post_id,
    temp_id,
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
  //console.log(ui)
  //console.log(votes)
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate()
  const relTime = useRelativeTime(created_at)

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleDeletePost = useCallback(async () => {
    await onDeletePost('post', post);
  }, [post, onDeletePost]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVote = useCallback(async (voteType) => {
    if (!user) navigate('/login');
    if (ui.isVoting) return;
    
    const previousVote = user_vote;
    let newVote = previousVote === voteType ? null : voteType;
    let newUpvotes = votes.up;
    let newDownvotes = votes.down;

    if (previousVote === 'up') newUpvotes--;
    if (previousVote === 'down') newDownvotes--;
    if (newVote === 'up') newUpvotes++;
    if (newVote === 'down') newDownvotes++;

    await onVote(post_id, temp_id, voteType, {
      up: newUpvotes,
      down: newDownvotes
    }, newVote);
  }, [post, onVote]);

  const commentsArray = useMemo(() =>
    Object.values(comments).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [comments]
  );

  return (
    <Card className="my-8 p-4">
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
            By {author.username} • posted {relTime}
          </Typography>
        }
        action={user &&
          <>
            <IconButton 
              onClick={handleMenu}
              aria-label="options"
            >
              <MoreVert />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem>Report</MenuItem>
              {(user.account_type === "SUPERUSER" 
                || author.user_id === user.id) && 
                <>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem
                    onClick={handleDeletePost}
                  >Delete</MenuItem>
                </>}
            </Menu>
          </>
        }
      >
      </CardHeader>
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
          onDeleteComment={onDeleteComment}
          onEditComment={onEditComment}
        />
      </CardContent>

      <CardActions>

      </CardActions>
    </Card>

  );
};

export default PostComponent;
