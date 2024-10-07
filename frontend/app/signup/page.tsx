'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import { Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'store_owner'>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If the user is already authenticated, redirect to the dashboard
    if (token) {
      router.push('/');  // Redirect to the dashboard if logged in
    }
  }, [token, router]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box
        className="bg-white space-x-3 shadow-lg rounded-lg p-8 w-full max-w-md gap-2"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h4" className="mb-6">
          Sign Up
        </Typography>

        {/* Name Field */}
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className="mb-4"
        />

        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          className="mb-4"
        />

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          className="mb-4"
        />

        {/* Confirm Password Field */}
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          className="mb-4"
        />

        {/* Role Selection */}
        <FormControl fullWidth className="mb-4">
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value as 'customer' | 'store_owner')}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="store_owner">Store Owner</MenuItem>
          </Select>
        </FormControl>

        {error && <Typography color="error" className="mb-4">{error}</Typography>}
        {success && <Typography color="primary" className="mb-4">{success}</Typography>}

        {/* Sign-Up Button */}
        <Button variant="contained" color="primary" onClick={handleSignUp} fullWidth className="mb-4">
          Sign Up
        </Button>

        {/* Redirect to Login */}
        <Typography variant="body2" className="mb-4">
          Already have an account?{' '}
          <Button color="secondary" onClick={() => router.push('/login')}>
            Login
          </Button>
        </Typography>
      </Box>
    </div>
  );
};

export default SignUpPage;
