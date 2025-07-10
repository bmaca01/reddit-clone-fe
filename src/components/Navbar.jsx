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
import { AccountCircle, Dashboard, Person, ExitToApp, Search, Menu as MenuIcon, Close } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchData, setSearchData] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
      <Toolbar className="flex items-center justify-between gap-x-2 border-b border-b-border">
        {/*Logo*/}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className="flex text-white visited:text-white no-underline font-bold"
        >
          reddish
        </Typography>
        {/*<div className={`flex items-center grow justify-start flex-col absolute top-[71.5px] right-0 w-full ${menuOpen ? "visible" : "invisible"}`}>*/}
        {/* <div className={`flex items-center h-[calc(100vh-71.5px)] grow justify-start flex-col absolute top-[71.5px] right-0 w-full md:visible md:flex-row md:justify-end md:static md:h-auto ${menuOpen ? "visible" : "invisible"}`}> */}
        <div className={`flex items-center h-fill grow justify-start flex-col absolute top-[71.5px] right-0 w-full md:visible md:flex-row md:justify-end md:static md:h-auto ${menuOpen ? "visible" : "invisible"}`}>
          <div className="flex flex-col justify-end h-fill w-full py-2 px-4 gap-1 bg-current md:flex-row md:bg-inherit">

            {//routes.map((route, index) => (
              /*
              <Link
                key={index}
                href={route.href}
                className={`inline-flex h-10 w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground`}
              >
                {route.title}
              </Link>
              */
            //))}
            }
            <Button 
              variant="secondary" 
              component={Link}
              to="/login"
              className="w-full md:px-1 md:w-auto"
            >
              Log In
            </Button>
            <Button 
              variant="default" 
              component={Link}
              to="/register"
              className="w-full md:w-auto"
            >
              Register
            </Button>
          </div>
          <div className="h-full w-full bg-background/70 md:hidden" />

        </div>
        <div className="md:hidden">
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
          {/**
          <IconButton color="inherit" onClick={toggleMenu}>
            {menuOpen ? (<Close />) : (<MenuIcon />)}

          </IconButton>
           * 
           */}

        </div>

        {/* Search Bar */}
        {/**
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
         * 
        */}
        
        {/* Buttons */}
        {/*
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
        */}



      </Toolbar>
    </AppBar>
  );
};

export default Navbar;