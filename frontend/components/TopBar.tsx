'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Typography, Box, Popover, Button, Tooltip } from '@mui/material';
import { ShoppingCart, Home, AccountCircle, Receipt } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store'; // Adjust the import based on your Redux setup
import { logout } from '../features/authSlice'; // Adjust the import based on your Redux setup
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

const TopBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Open the popover when the account button is clicked
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      document.cookie = "token=; max-age=0; path=/;";

      // Clear the Redux state (or any other state management)
      dispatch(logout());

      handlePopoverClose();  // Close the popover after logout
      // Redirect the user to the login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {user && (
        <AppBar position="static" className="bg-white shadow-md">
      <Toolbar className="flex justify-between">
        {/* Logo */}
        <Typography variant="h6" className="text-white font-bold">
          <Link href="/">MyShop</Link>
        </Typography>

        {/* Right-side Icons */}
        <Box>

          <Tooltip title="Home" arrow>
          <IconButton color="inherit" component={Link} href="/">
            <Home className="text-gray-600" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Orders" arrow>
          <IconButton color="inherit" component={Link} href="/orders">
            <Receipt className="text-gray-600" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Cart" arrow>
          <IconButton color="inherit" component={Link} href="/cart">
            <ShoppingCart className="text-gray-600" />
          </IconButton>
          </Tooltip>

          <Tooltip title="Account" arrow>
          <IconButton color="inherit" onClick={handlePopoverOpen}>
            <AccountCircle className="text-gray-600" />
          </IconButton>
          </Tooltip>
          {/* Popover for user details and logout */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box className="p-4">
              <Typography variant="body1">
                <strong>Name:</strong> {user?.name || 'Guest'}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user?.email || 'Not logged in'}
              </Typography>

              {/* Logout button */}
              <Button variant="contained" color="secondary" onClick={handleLogout} className="mt-4">
                Logout
              </Button>
            </Box>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
      )}
    </>
  );
};

export default TopBar;
