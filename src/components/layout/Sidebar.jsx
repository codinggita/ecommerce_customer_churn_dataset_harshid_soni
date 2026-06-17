import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { LayoutDashboard, Users, LineChart, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { text: 'Customers', icon: <Users size={20} />, path: '/customers' },
  { text: 'Analytics', icon: <LineChart size={20} />, path: '/analytics' },
  { text: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? drawerWidth : 64,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: sidebarOpen ? drawerWidth : 64, 
          boxSizing: 'border-box',
          transition: 'width 0.2s',
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <ToolbarSpacer />
      <Box sx={{ overflow: 'hidden' }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                    color: isActive ? 'primary.main' : 'text.primary',
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: sidebarOpen ? 1 : 0 }}
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

// Invisible spacer to push content below AppBar
const ToolbarSpacer = () => <Box sx={{ minHeight: 64 }} />;
