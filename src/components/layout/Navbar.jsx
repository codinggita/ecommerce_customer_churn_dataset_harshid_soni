import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { Menu as MenuIcon, Moon, Sun, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeMode } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-700" color="transparent" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          <span className="text-blue-600 dark:text-blue-400">Churn</span>Analytics
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
            {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
          
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.firstName?.charAt(0) || <User size={20} />}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
