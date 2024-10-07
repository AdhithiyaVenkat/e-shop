'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './globals.css';
import TopBar from '@/components/TopBar';
import { ToastContainer } from 'react-toastify';

// Create a Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    }
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Redux and Persist Integration */}
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {/* Material UI Theme Provider */}
            <ThemeProvider theme={theme}>
              {/* Normalize and provide basic CSS across browsers */}
              <CssBaseline />
              {/* Render the children (the pages) */}
              <ToastContainer />
              <TopBar />
              {children}
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
