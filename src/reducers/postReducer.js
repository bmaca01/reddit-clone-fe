import { data } from "autoprefixer";

// Posts reducer for complex state management
const postsReducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE_POSTS':
      return action.posts.reduce((acc, post) => ({
        ...acc,
        data: {
          ...acc.data,
          [post.temp_id]: {
            ...post,
            votes: { up: post.up_votes || 0, down: post.down_votes || 0 },    // redundant...
            userVote: post.user_vote || null,   // redundant...
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
              isPending: false,
              commentsExpanded: false,
              isVoting: false,
              isCommenting: false,
              isAddingComment: false,
              newComment: '',
              errors: {},
            },
          }
        },
        ui: {
          addPostModal: {
            isOpen: false,  // or false
            form: {
              title: '',
              content: '',
              isSubmitting: false,
              errors: {}
            }
          }
        }
      }), {});

    case 'START_VOTE':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            ui: { 
              ...state.data[action.postId].ui, 
              isVoting: true,
              isPending: true
            }
          }
        }
      };

    case 'UPDATE_POST_VOTES':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            votes: action.votes,
            userVote: action.userVote,
            user_vote: action.userVote,
            ui: { 
              ...state.data[action.postId].ui, 
              isVoting: false,
              isPending: false,
              errors: { ...state.data[action.postId].ui.errors, vote: null }
            }
          }
        }
      };

    case 'VOTE_ERROR':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            ui: {
              ...state.data[action.postId].ui,
              isVoting: false,
              isPending: false,
              errors: { ...state.data[action.postId].ui.errors, vote: action.error }
            }
          }
        }
      };

    case 'TOGGLE_COMMENTS':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            ui: {
              ...state.data[action.postId].ui,
              commentsExpanded: !state.data[action.postId].ui.commentsExpanded
            }
          }
        }
      };

    case 'START_COMMENT':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            ui: { ...state.data[action.postId].ui, isAddingComment: true }
          }
        }
      };

    case 'UPDATE_COMMENT_TEXT':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            ui: { ...state.data[action.postId].ui, newComment: action.text }
          }
        }
      };

    case 'CANCEL_COMMENT':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            ui: { 
              ...state.data[action.postId].ui, 
              isAddingComment: false, 
              newComment: '',
              errors: { ...state.data[action.postId].ui.errors, comment: null }
            }
          }
        }
      };

    case 'ADD_COMMENT_OPTIMISTIC':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            comments: {
              ...state.data[action.postId].comments,
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
              ...state.data[action.postId].ui,
              isCommenting: true,
              newComment: '',
              isAddingComment: false
            }
          }
        }
      };

    case 'COMMENT_SUCCESS':
      return {
        ...state,
        data: {
          ...state.data,
          [action.postId]: {
            ...state.data[action.postId],
            comments: {
              ...state.data[action.postId].comments,
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
              ...state.data[action.postId].ui,
              isCommenting: false,
              errors: { ...state.data[action.postId].ui.errors, comment: null }
            }
          }
        }
      };

    case 'COMMENT_ERROR':
      const { [action.tempId]: _, ...newState } = state;  // Remove the optimistic comment by making a new state
      return {
        ...newState,
        data: {
          [action.postId]: {
            ...newState[action.postId],
            ui: {
              ...newState.data[action.postId].ui,
              isCommenting: false,
              isAddingComment: true,
              newComment: action.originalText,
              errors: { ...newState.data[action.postId].ui.errors, comment: action.error }
            }
          }
        }
      };

    case 'START_COMMENT_VOTE':
      return {
        ...state,
        data: {
          [action.postId]: {
            ...state.data[action.postId],
            comments: {
              ...state.data[action.postId].comments,
              [action.tempId]: {
                ...state.data[action.postId].comments[action.tempId],
                ui: {
                  ...state.data[action.postId].comments[action.tempId].ui,
                  isVoting: true,
                }
              }
            }
          }
        }
      };

    case 'UPDATE_COMMENT_VOTES':
      return {
        ...state,
        data: {
          [action.postId]: {
            ...state.data[action.postId],
            comments: {
              ...state.data[action.postId].comments,
              [action.tempId]: {
                ...state.data[action.postId].comments[action.tempId],
                up_votes: action.upvotes,
                down_votes: action.downvotes,
                user_vote: action.userVote,
                ui: {
                  ...state.data[action.postId].comments[action.tempId].ui,
                  isPending: false,
                  isVoting: false,
                  errors: {
                    ...state.data[action.postId].comments[action.tempId].ui.errors,
                    voteError: null,
                  }
                }
              }
            }
          }
        }
      };

    case 'COMMENT_VOTE_ERROR':
      return {
        ...state,
        data: {
          [action.postId]: {
            ...state.data[action.postId],
            comments: {
              ...state.data[action.postId].comments,
              [action.tempId]: {
                ...state.data[action.postId].comments[action.tempId],
                ui: {
                  ...state.data[action.postId].comments[action.tempId].ui,
                  isPending: false,
                  isVoting: false,
                  errors: {
                    ...state.data[action.postId].comments[action.tempId].ui.errors,
                    voteError: action.error
                  }
                }
              }
            }
          }
        }
      }
        
    case 'OPEN_ADD_POST_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          addPostModal: {
            isOpen: true,
            form: {
              title: '',
              content: '',
              isSubmitting: false,
              errors: {}
            }
          }
        }
      };

    case 'CLOSE_ADD_POST_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          addPostModal: {
            isOpen: false,
            form: {
              title: '',
              content: '',
              isSubmitting: false,
              errors: {}
            }
          },
        },
      };

    case 'UPDATE_POST_FORM':
      return {
        ...state,
        ui: {
          ...state.ui,
          addPostModal: {
            ...state.ui.addPostModal,
            form: {
              ...state.ui.addPostModal.form,
              [action.field]: action.value,
              errors: {
                ...state.ui.addPostModal.form.errors,
                [action.field]: null
              }
            }
          }
        }
      };

    case 'ADD_POST_OPTIMISTIC':
      return {
        ...state,
        data: {
          ...state.data,
          [action.tempId]: {
            author: action.postAuthor,
            user_id: action.userId,
            post_id: null,
            temp_id: action.tempId,
            title: action.title,
            content: action.content,
            created_at: (new Date(Date.now())).toISOString(),
            updated_at: (new Date(Date.now())).toISOString(),
            up_votes: 0,
            down_votes: 0,
            user_vote: null,
            userVote: null,
            comments: [],
            votes: {
              up: 0,
              down: 0
            },
            ui: {
              commentsExpanded: false,
              isVoting: false,
              isPending: true,
              isCommenting: false,
              isAddingComment: false,
              newComment: '',
              errors: {},
            }
          }
        },
        ui: {
          ...state.ui,
          addPostModal: {
            ...state.ui.addPostModal,
            form: {
              ...state.ui.addPostModal.form,
              isSubmitting: true
            }
          }
        }
      };

    case 'ADD_POST_SUCCESS':
      return {
        ...state,
        data: {
          ...state.data,
          [action.tempId]: {
            ...state.data[action.tempId],
            ...action.post,
            //post_id: action.post.post_id,
            ui: {
              ...state.data[action.tempId].ui,
              isPending: false,
            }
          }
        },
        ui: {
          ...state.ui,
          addPostModal: {
            ...state.ui.addPostModal,
            form: {
              ...state.ui.addPostModal.form,
              isSubmitting: false
            }
          }
        }
      };
    
    case 'ADD_POST_ERROR':
      const { [action.tempId]: __, ...s2 } = state;
      return {
        ...s2,
        data: {
          ...state.data,
          [action.tempId]: {
            ...state.data[action.tempId],
            ui: {
              ...state.data[action.tempId].ui,
              isPending: false,
            }
          }
        },
        ui: {
          ...state.ui,
          addPostModal: {
            ...state.ui.addPostModal,
            form: {
              ...state.ui.addPostModal.form,
              isSubmitting: false
            }
          }
        }
      };

    default:
      return state;
  }
};

export default postsReducer;