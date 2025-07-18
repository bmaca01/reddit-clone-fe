import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Alert,
} from '@mui/material';
import { Comment as CommentIcon, ExpandMore, ExpandLess } from '@mui/icons-material';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentsSection = ({
  post,
  commentsArray,
  onCommentVote,
  onAddComment,
  onToggleComments,
  onStartComment,
  onUpdateComment,
  onCancelComment,
  onDeleteComment,
  onEditComment
}) => {
  //console.log(post);
  return (
    <>
      {/* <Box className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"> */}
      <Box className="flex items-center justify-between p-4 bg-gradient-to-r rounded-xl border border-blue-200">
        <div className="flex items-center gap-3">
          <CommentIcon className="text-blue-600" fontSize="small" />
          <Typography variant="body2" className="font-semibold text-blue-800">
            {commentsArray.length} Comments
          </Typography>
        </div>

        <IconButton
          onClick={() => onToggleComments(post.temp_id)}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200"
          size="small"
        >
          {post.ui.commentsExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={post.ui.commentsExpanded} timeout="auto" unmountOnExit>
        <div className="mt-6 space-y-4">
          {post.ui.errors.comment && (
            <Alert severity="error">
              Failed to add comment: {post.ui.errors.comment}
            </Alert>
          )}

          <CommentForm
            post={post}
            isAddingComment={post.ui.isAddingComment}
            newComment={post.ui.newComment}
            isCommenting={post.ui.isCommenting}
            error={post.ui.errors.comment}  // TODO implement
            onStartComment={onStartComment}
            onUpdateComment={onUpdateComment}
            onCancelComment={onCancelComment}
            onAddComment={onAddComment}
          />

          <div className="space-y-6">
            {commentsArray.map((comment, index) => (
              <div key={index}>
                <CommentItem
                  comment={comment}
                  onVote={onCommentVote}
                  postId={post.post_id}
                  postTempId={post.temp_id}
                  onDeleteComment={onDeleteComment}
                  onEditComment={onEditComment}
                />
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default CommentsSection;
