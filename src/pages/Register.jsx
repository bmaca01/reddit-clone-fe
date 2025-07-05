import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    //name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const { register, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    
    const result = await register({
      //name: formData.name,
      email: formData.email,
      password: formData.password,
    })
    
    console.log(result);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm" className="py-8">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" gutterBottom className="text-center text-blue-600 font-bold">
          Register
        </Typography>
        
        {(error || validationError) && (
          <Alert severity="error" className="mb-4">
            {error || validationError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          {/**
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            disabled={loading}
          />
          
           */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
            disabled={loading}
            helperText="Password must be at least 6 characters long"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            variant="outlined"
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 mt-6"
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
        
        <Box className="mt-4 text-center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;