import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

export default function Layout() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }} className="bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 64}px)` },
          mt: 8,
          overflowY: 'auto',
          transition: 'width 0.2s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
