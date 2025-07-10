import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../../contexts/AuthContext';

function DeleteDialog(props) {
  //console.log(props)
  const { user } = useAuth();
  const { isOpen, onClose, item, onDeletePost, onDeleteComment } = props;
  const [action, setAction] = useState(null);
  //console.log(item && (Object.hasOwn(item, 'comment_id')))
  //const isComment = item && (Object.hasOwn(item, 'comment_id'));
  const isComment = item?.itemType === 'comment';

  const handleDelete = () => {
    if (isComment) {
      onDeleteComment(item?.item);
    } else {
      onDeletePost(item?.item);
    }

  };


  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
            Delete {isComment ? "comment" : "post"}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {onClose()}}>Disagree</Button>
          <Button onClick={() => {handleDelete()}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteDialog;