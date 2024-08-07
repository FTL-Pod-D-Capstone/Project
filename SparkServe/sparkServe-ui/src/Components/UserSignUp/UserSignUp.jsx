import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import UserSignIn from '../../Components/UserSignIn/UserSignIn';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.linkedin.com/company/salesforce">
        SparkServe
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function UserSignUp() {
  const navigate = useNavigate();
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formErrors, setFormErrors] = React.useState({});
  const [formData, setFormData] = React.useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.username) errors.username = 'Username is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.firstName) errors.firstName = 'First name is required';
    if (!data.lastName) errors.lastName = 'Last name is required';
    if (!data.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!data.password) errors.password = 'Password is required';
    if (!data.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const clearForm = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/users/register`, formData);
      
      if (response.data && response.status === 201) {
        setError('');
        clearForm();
        handleOpenSignIn();
      } else {
        console.error('Unexpected response:', response);
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred while registering. Please try again.');
    }
  };

  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBackToWelcome}
            sx={{ alignSelf: 'flex-start', mb: 2 }}
          >
            Back
          </Button>
          <Avatar sx={{ m: 1, bgcolor: '#4856f6' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.firstName)}
                  helperText={formErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.lastName)}
                  helperText={formErrors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.username)}
                  helperText={formErrors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.phoneNumber)}
                  helperText={formErrors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.confirmPassword)}
                  helperText={formErrors.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={handleOpenSignIn} variant="body2" style={{ cursor: 'pointer' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <UserSignIn open={openSignIn} handleClose={handleCloseSignIn} />
    </ThemeProvider>
    </>
  );
}