import { 
  Paper, 
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box, 
  Container, 
  Typography, 
  Divider,
  IconButton,
} from '@mui/material'

import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

import { ArrowCircleDown, ArrowCircleDownTwoTone, ArrowCircleUp, ArrowCircleUpTwoTone } from '@mui/icons-material'

function Post(props) {
  const { user } = useAuth();
  const { 
    author,
    post_id, 
    user_id,
    title, 
    content, 
    up_votes, 
    down_votes, 
    created_at, 
    updated_at
  } = props;

  return (
    <Box>
      <Paper className="p-8 m-8">
        <Box className="flex gap-8">
          <Box className="flex items-center gap-x-4">
            <IconButton>
              <ArrowCircleUp fontSize="large" />
            </IconButton>
            <Typography>{up_votes - down_votes}</Typography>
            <IconButton>
              <ArrowCircleDown fontSize="large" />
            </IconButton>
          </Box>
          <Typography variant="caption">
            Created At: {created_at} <br />
            Last Update: {updated_at}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" className="px-2">
            Author: {author.username}
          </Typography>

        </Box>
        <Typography variant="h3" className="px-2 pb-5">
          {title}
        </Typography>
        <Divider />
        <Typography variant="body1" className="px-2 py-4">
          {content}
        </Typography>
      </Paper>
    </Box>
  );

};

export default Post;