import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Close,
  Send,
  Image,
  Link,
  FormatBold,
  FormatItalic
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext'

const AddPostModal = ({ isOpen, onClose, onSubmit, formData, onFormChange, isSubmitting, errors }) => {
  const { user } = useAuth();
  const [richTextMode, setRichTextMode] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(user, user.id, formData.title.trim(), formData.content.trim());
    }
  };

  const handleFormChange = (field, value) => {
    onFormChange(field, value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-2xl shadow-2xl"
      }}
      className="backdrop-blur-sm"
    >
      <DialogTitle className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="font-bold text-gray-800">
            Create New Post
          </Typography>
          <IconButton
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            size="small"
          >
            <Close />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <TextField
            fullWidth
            label="Post Title"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            variant="outlined"
            className="bg-white"
            inputProps={{ maxLength: 200 }}
          />

          {/* Content Field with Rich Text Toolbar */}
          <Box className="space-y-2">
            <div className="flex items-center justify-between">
              <Typography variant="subtitle2" className="text-gray-700 font-medium">
                Content
              </Typography>
              <div className="flex items-center gap-1">
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Bold"
                >
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Italic"
                >
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Add Image"
                >
                  <Image fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Add Link"
                >
                  <Link fontSize="small" />
                </IconButton>
              </div>
            </div>

            <TextField
              fullWidth
              multiline
              rows={8}
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.target.value)}
              error={!!errors.content}
              helperText={errors.content}
              variant="outlined"
              placeholder="Write your post content here... You can use HTML markup for formatting."
              className="bg-white"
            />

            {/* Character Counter */}
            <Typography variant="caption" className="text-gray-500 text-right block">
              {formData.content.length} characters
            </Typography>
          </Box>

          {/* Image Upload Area (Placeholder) */}
          <Box className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <Image className="mx-auto text-gray-400 mb-2" fontSize="large" />
            <Typography variant="body2" className="text-gray-500">
              Drag and drop images here, or click to select
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Supports JPG, PNG, GIF up to 10MB
            </Typography>
          </Box>
        </form>
      </DialogContent>

      <DialogActions className="p-6 border-t border-gray-200 bg-gray-50">
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold ml-2"
          startIcon={isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Send />}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostModal;