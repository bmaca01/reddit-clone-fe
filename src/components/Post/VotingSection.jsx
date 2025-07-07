import { useCallback } from 'react'
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'

import {
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material'

function VotingSection({
  votes, userVote, 
  isVoting = false, onVote, 
  error = null, variant = 'post',
  disabled = false
}) 
{
  const handleVote = useCallback(async (voteType) => {
    if (isVoting || disabled) return;
    try {
      await onVote(voteType);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  }, [isVoting, disabled, onVote]);

  // Styling based on variant
  const getContainerStyles = () => {
    if (variant === 'comment') {
      return "flex items-center gap-3 pt-2";
    }
    return "flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200";
  };

  const getTypographyVariant = () => {
    return variant === 'comment' ? 'caption' : 'body2';
  };

  const getIconSize = () => {
    return variant === 'comment' ? 'small' : 'small';
  };

  const getProgressSize = () => {
    return variant === 'comment' ? 12 : 20;
  };

  const getMinWidth = () => {
    return variant === 'comment' ? 'min-w-[1.5rem]' : 'min-w-[2rem]';
  };

  return (
    <>
      {error && (
        <Alert severity="error" className="mb-4">
          Failed to save vote: {error}
        </Alert>
      )}
      <Box className="getContainerStyles()">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => handleVote('up')}
            disabled={isVoting || disabled}
            className={`transition-all duration-200 hover:scale-110 ${
              userVote === 'up' 
                ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
            }`}
            size={getIconSize()}
            aria-label="Upvote"
          >
            {isVoting ? (
              <CircularProgress size={getProgressSize()} className="text-green-600" />
            ) : (
              <ThumbUp fontSize="small" />
            )}
          </IconButton>
          <Typography 
            variant={getTypographyVariant()}
            className={`font-semibold text-gray-700 ${getMinWidth()} text-center`}
          >
            {votes.up}
          </Typography>
        </div>
            
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => handleVote('down')}
            disabled={isVoting || disabled}
            className={`transition-all duration-200 hover:scale-110 ${
              userVote === 'down' 
                ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            }`}
            size={getIconSize()}
            aria-label="Downvote"
          >
            {isVoting ? (
              <CircularProgress size={getProgressSize()} className="text-red-600" />
            ) : (
              <ThumbDown fontSize="small" />
            )}
          </IconButton>
          <Typography 
            variant={getTypographyVariant()}
            className={`font-semibold text-gray-700 ${getMinWidth()} text-center`}
          >
            {votes.down}
          </Typography>
        </div>
      </Box>
    </>
  );
};

export default VotingSection;