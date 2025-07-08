import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { 
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography, 
  Divider,
  Avatar,
} from '@mui/material'

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
    onCancelComment
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

  const navigate = useNavigate()
  const relTime = useRelativeTime(created_at)

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

    //console.log({ post_id, temp_id, voteType, newVote })

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
            By {author.username} • posted {relTime}
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

  );
};

export default PostComponent;
