'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/authSlice';
import api from '../../utils/api';
import { TextField, Button, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { RootState } from '@/store/store';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If the user is already authenticated, redirect to the dashboard
    if (token) {
      router.push('/');  // Redirect to the dashboard if logged in
    }
  }, [token, router]);

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      // Store the token in cookies
      document.cookie = `token=${data.token}; path=/`;

      // Dispatch the login event to Redux
      dispatch(login({ user: data, token: data.token }));

      // Redirect to the home page
      router.push('/');
    } catch (error) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md gap-2"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h4" className="mb-6">
          {'Login'}
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          className="mb-4"
        />

        {error && <Typography color="error" className="mb-4">{error}</Typography>}

        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth className="mb-4">
          Login
        </Button>

        <Typography variant="body2" className="mb-4">
          Don't have an account?{' '}
          <Button color="secondary" onClick={() => router.push('/signup')}>
            Sign Up
          </Button>
        </Typography>
      </Box>
    </div>
  );
};

export default LoginPage;
