import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';

const AddPostFab = ({ onClick }) => (
  <Fab
    color="primary"
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
      '&:hover': {
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        transform: 'scale(1.05)',
      },
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '&:hover': {
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1300,
    }}
    size="large"
  >
    <Add />
  </Fab>
);

export default AddPostFab;