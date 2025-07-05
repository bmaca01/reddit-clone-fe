import { Link } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { user } = useAuth();

  return (
    <Container maxWidth="false" className="py-8">
      <Paper elevation={3} className="p-8 text-center">
      </Paper>
    </Container>
  );
};

export default Home;