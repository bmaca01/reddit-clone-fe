
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
          //comments: post.comments || [],
          comments: post.comments.length > 0 ? (post.comments.reduce((acc, comment) => ({
            ...acc,
            [comment.temp_id]: {
              ...comment,
              ui: {
                isVoting: false,
                isPending: false,
                errors: {}
              }
            }

          }), {})) : {},
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
          user_vote: action.userVote,
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
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: {
            ...state[action.postId].comments,
            [action.tempId]: {
              comment_id: null,
              temp_id: action.tempId,
              author: action.commentAuthor,
              content: action.content,
              up_votes: 0,
              down_votes: 0,
              userVote: null,
              created_at: (new Date(Date.now())).toISOString(),
              updated_at: (new Date(Date.now())).toISOString(),
              ui: {
                isPending: true,
                isVoting: false,
                errors: {}
              }
            }
          },
          ui: {
            ...state[action.postId].ui,
            isCommenting: true,
            newComment: '',
            isAddingComment: false
          }
        }
      };

    case 'COMMENT_SUCCESS':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: {
            ...state[action.postId].comments,
            [action.tempId]: {
              ...action.comment,
              ui: {
                isPending: false,
                isVoting: false,
                errors: {}
              }
            }
          },
          ui: {
            ...state[action.postId].ui,
            isCommenting: false,
            errors: { ...state[action.postId].ui.errors, comment: null }
          }
        }
      };

    case 'COMMENT_ERROR':
      const { [action.tempId]: _, ...newState } = state;  // Remove the optimistic comment by making a new state
      return {
        ...newState,
        [action.postId]: {
          ...newState[action.postId],
          ui: {
            ...newState[action.postId].ui,
            isCommenting: false,
            isAddingComment: true,
            newComment: action.originalText,
            errors: { ...newState[action.postId].ui.errors, comment: action.error }
          }
        }
      };

    case 'START_COMMENT_VOTE':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: {
            ...state[action.postId].comments,
            [action.tempId]: {
              ...state[action.postId].comments[action.tempId],
              ui: {
                ...state[action.postId].comments[action.tempId].ui,
                isVoting: true,
              }
            }
          }
        }
      };

    case 'UPDATE_COMMENT_VOTES':
      return {
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: {
            ...state[action.postId].comments,
            [action.tempId]: {
              ...state[action.postId].comments[action.tempId],
              up_votes: action.upvotes,
              down_votes: action.downvotes,
              user_vote: action.userVote,
              ui: {
                ...state[action.postId].comments[action.tempId].ui,
                isPending: false,
                isVoting: false,
                errors: {
                  ...state[action.postId].comments[action.tempId].ui.errors,
                  voteError: null,
                }
              }
            }
          }
        }
      };

    case 'COMMENT_VOTE_ERROR':
      return {
        //...state,
        //[action.postId]: {
        //  ...state[action.postId],
        //  comments: state[action.postId].comments.map(comment =>
        //    comment.comment_id === action.commentId
        //      ? {
        //          ...comment,
        //          isVoting: false,
        //          voteError: action.error
        //        }
        //      : comment
        //  )
        //}
        ...state,
        [action.postId]: {
          ...state[action.postId],
          comments: {
            ...state[action.postId].comments,
            [action.tempId]: {
              ...state[action.postId].comments[action.tempId],
              ui: {
                ...state[action.postId].comments[action.tempId].ui,
                isPending: false,
                isVoting: false,
                errors: {
                  ...state[action.postId].comments[action.tempId].ui.errors,
                  voteError: action.error
                }
              }
            }
          }
        }
      }

    default:
      return state;
  }
};

export default postsReducer;