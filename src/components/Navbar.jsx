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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { 
  AccountCircle, 
  Dashboard, 
  Person, 
  AppRegistration,
  Login,
  ExitToApp, 
  Search, 
  Menu as MenuIcon, 
  Close, 
  Feed as FeedIcon 
} from '@mui/icons-material'
import { useMediaQuery } from 'react-responsive'
import { useAuth } from '../contexts/AuthContext'

function MobileMenu(props) {
  const {menuOpen, toggleDrawer, handleLogout} = props
  const { user } = useAuth();
  return (
    <div className="md:hidden">
      <>
        <IconButton color="inherit" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={menuOpen}
          onClose={toggleDrawer(false)}
        >
          <Box 
            role="presentation"
            className="w-48 pt-12"
          >
            {user ? (
              <>
                <ListItemButton
                  component={Link}
                  onClick={toggleDrawer(false)}
                  to="/"
                >
                  <ListItemIcon>
                    <FeedIcon />
                  </ListItemIcon>
                  Feed
                </ListItemButton>
                <ListItemButton
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>
                    <Search />
                  </ListItemIcon>
                  Search
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  onClick={toggleDrawer(false)}
                  to="/Dashboard"
                >
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  Dashboard
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  onClick={toggleDrawer(false)}
                  to="/profile"
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  Profile
                </ListItemButton>
                <ListItemButton
                  onClick={handleLogout}
                >
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  Logout
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton
                  component={Link}
                  to="/register"
                  onClick={toggleDrawer(false)}
                >
                    <ListItemIcon>
                      <AppRegistration />
                    </ListItemIcon>
                  <ListItemText>Register</ListItemText>
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/login"
                  onClick={toggleDrawer(false)}
                >
                    <ListItemIcon>
                      <Login />
                    </ListItemIcon>
                  <ListItemText>Login</ListItemText>
                </ListItemButton>
              </>
            )}
          </Box>
        </Drawer>
      </>
    </div>
  );
}

function AuthActions(props) {
  const { handleLogout } = props;
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
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
    </div>
  );
}

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isMobileLandscape = isTabletOrMobile && !isPortrait;

  if (isDesktopOrLaptop) console.log('desktop / laptop');
  if (isBigScreen) console.log('big screen');
  if (isTabletOrMobile) console.log('tablet / mobile');
  if (isPortrait) console.log('portrait');
  if (isMobileLandscape) console.log('mobile landscape');

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

  const handleLogout = () => {
    logout();
    navigate('/');
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <AppBar position="fixed" className="bg-white shadow-lg">
      <Toolbar className="flex items-center justify-between gap-x-2 mx-4 xl:mx-96 border-b border-b-border">
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
        {/*
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
              fullWidth
            />
          </Paper>
        </Box>
        */}
        <AuthActions
          handleLogout={handleLogout}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;