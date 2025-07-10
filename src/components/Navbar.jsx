import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Paper,
  InputBase,
} from '@mui/material'
import { AccountCircle, Dashboard, Person, ExitToApp, Search, MenuIcon } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchData, setSearchData] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO
    alert('SEARCHING: ' + searchData);
    setSearchData('');

  };

  const handleChange = (e) => {
    setSearchData(e.target.value);
    console.log(e.target.value);

  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <AppBar position="fixed" className="bg-white shadow-lg">
      <Toolbar className="flex justify-center gap-x-2 mx-80">
        {/*Logo*/}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className="flex text-white visited:text-white no-underline font-bold"
        >
          reddish
        </Typography>

        {/* Search Bar */}
        <Box className="flex-grow max-w-screen-lg items-center mx-16">
          <Paper
            component="form"
            className="visible flex p-1 items-center w-auto"
            onSubmit={handleSearch}
          >
            <Search />
            <InputBase 
              placeholder="Search" 
              value={searchData}
              onChange={handleChange}
              className="mx-2" 
            />
          </Paper>
        </Box>
        
        {/* Buttons */}
        <Box className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                variant="contained"
                component={Link}
                to="/Dashboard"
              >
                <Dashboard />
                Dashboard
              </Button>
              <IconButton

                size="large"
                onClick={handleMenu}
                color="inherit"
                className="text-gray-700"
              >
                <Avatar className="w-8 h-8">
                  {user.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <Person className="mr-2" />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp className="mr-2" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                className="text-gray-700"
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;