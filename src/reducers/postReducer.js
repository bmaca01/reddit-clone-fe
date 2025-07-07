
// Posts reducer for complex state management
const postsReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_POSTS':
      return action.posts.reduce((acc, post) => ({
        ...acc,
        [post.post_id]: {
          ...post,
          votes: { up: post.up_votes || 0, down: post.down_votes || 0 },
          userVote: post.user_vote || null,
          comments: post.comments || [],
          ui: {
            commentsExpanded: false,
            isVoting: false,
            isCommenting: false,
            isAddingComment: false,
            newComment: '',
            errors: {}
          }
        }
      }), {});

    case 'START_VOTE':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { ...state[action.postId].ui, isVoting: true }
        }
      };

    case 'UPDATE_POST_VOTES':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          votes: action.votes,
          userVote: action.userVote,
          ui: { 
            ...state[action.postId].ui, 
            isVoting: false,
            errors: { ...state[action.postId].ui.errors, vote: null }
          }
        }
      };

    case 'VOTE_ERROR':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: {
            ...state[action.postId].ui,
            isVoting: false,
            errors: { ...state[action.postId].ui.errors, vote: action.error }
          }
        }
      };

    case 'TOGGLE_COMMENTS':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: {
            ...state[action.postId].ui,
            commentsExpanded: !state[action.postId].ui.commentsExpanded
          }
        }
      };

    case 'START_COMMENT':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { ...state[action.postId].ui, isAddingComment: true }
        }
      };

    case 'UPDATE_COMMENT_TEXT':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { ...state[action.postId].ui, newComment: action.text }
        }
      };

    case 'CANCEL_COMMENT':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          ui: { 
            ...state[action.postId].ui, 
            isAddingComment: false, 
            newComment: '',
            errors: { ...state[action.postId].ui.errors, comment: null }
          }
        }
      };

    case 'ADD_COMMENT_OPTIMISTIC':
      //console.log("IN ADD OPTIMISTIC")
      //console.log(`state: ${state}, action: ${action}`)
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: [
            ...state[action.postId].comments,
            {
              id: action.tempId,
              author: 'Current User',
              content: action.content,
              up_votes: 0,
              down_votes: 0,
              userVote: null,
              isPending: true,
              isVoting: false
            }
          ],
          ui: {
            ...state[action.postId].ui,
            isCommenting: true,
            newComment: '',
            isAddingComment: false
          }
        }
      };

    case 'COMMENT_SUCCESS':
      //console.log("IN COMMENT SUCCESS")
      //console.log(state)
      //console.log(action)
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.map(comment =>
            comment.comment_id === action.tempId 
              ? { 
                  ...action.comment, 
                  isPending: false, 
                  isVoting: false 
                }
              : comment
          ),
          ui: {
            ...state[action.postId].ui,
            isCommenting: false,
            errors: { ...state[action.postId].ui.errors, comment: null }
          }
        }
      };

    case 'COMMENT_ERROR':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.filter(
            comment => comment.comment_id !== action.tempId
          ),
          ui: {
            ...state[action.postId].ui,
            isCommenting: false,
            isAddingComment: true,
            newComment: action.originalText,
            errors: { ...state[action.postId].ui.errors, comment: action.error }
          }
        }
      };

    case 'SART_COMMENT_VOTE':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.map(comment =>
            comment.comment_id === action.commentId
              ? { ...comment, isVoting: true }
              : comment
          )
        }
      };

    case 'UPDATE_COMMENT_VOTES':
      //console.log('IN COMMENT VOTE')
      //console.log(state)
      console.log(action)
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.map(comment =>
            comment.comment_id === action.commentId
              ? { 
                  ...comment, 
                  up_votes: action.upvotes, 
                  down_votes: action.downvotes, 
                  user_vote: action.userVote,
                  isVoting: false,
                  voteError: null
                }
              : comment
          )
        }
      };

    case 'COMMENT_VOTE_ERROR':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: state[action.postId].comments.map(comment =>
            comment.comment_id === action.commentId
              ? {
                  ...comment,
                  isVoting: false,
                  voteError: action.error
                }
              : comment
          )
        }
      }

    default:
      return state;
  }
};

export default postsReducer;