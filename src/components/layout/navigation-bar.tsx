import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '@/utils/auth';
const buttonStyles = {
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'none',
};

const navLinks = ['/shops', '/auctions'];
const formatPathName = (path) =>
  path.replace('/', '').charAt(0).toUpperCase() + path.slice(2);

export const NavigationBar: React.FC = () => {
  const location = useLocation();
  const currentUser = auth.isAuthenticated();
  const shouldHideNavigation = ['/login', '/register'].includes(
    location.pathname,
  );

  if (shouldHideNavigation) return null;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box>
          {navLinks.map((path) => (
            <Link key={path} to={path}>
              <Button
                sx={{
                  ...buttonStyles,
                  color: location.pathname === path ? '#00ff00' : '#ffffff',
                }}
              >
                {formatPathName(path)}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
