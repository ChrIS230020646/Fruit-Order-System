import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import AuthService from '../utils/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login successful with HttpOnly Cookie');
        onLoginSuccess();
      } else {
        setLoginError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      console.error('Login error: user not find');
    } finally {
      setLoading(false);
    }
  };

  
  const handleGoogleLogin = async (credentialResponse) => {
    setGoogleLoading(true);
    setLoginError('');

    try {
      const result = await AuthService.googleLogin(credentialResponse.credential);
      
      if (result.success) {
        console.log('Google login successful');
        onLoginSuccess();
      } else {
        // 使用後端返回的詳細錯誤訊息
        const errorMsg = result.error || 'Google login failed';
        
        // 針對特定錯誤提供更友好的訊息
        if (errorMsg.includes('not registered') || errorMsg.includes('User not registered')) {
          setLoginError('此 Google 帳戶尚未註冊，請聯繫管理員');
        } else if (errorMsg.includes('Client ID') || errorMsg.includes('OAuth client')) {
          setLoginError('Google 登入配置錯誤，請聯繫管理員檢查設定');
        } else {
          setLoginError(errorMsg);
        }
      }
    } catch (error) {
      setLoginError('Google 登入失敗，請稍後再試');
      console.error('Google login error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
    
    let errorMessage = 'Google 登入失敗，請稍後再試';
    
    // 處理不同的 Google OAuth 錯誤
    if (error?.error === 'popup_closed_by_user') {
      errorMessage = '登入已取消';
    } else if (error?.error === 'access_denied') {
      errorMessage = '存取被拒絕，請檢查權限設定';
    } else if (error?.error === 'idpiframe_initialization_failed' || 
               error?.error === 'popup_blocked') {
      errorMessage = '彈出視窗被阻擋，請允許彈出視窗後重試';
    } else if (error?.error === 'invalid_client' || 
               error?.error === 'oauth_client_not_found') {
      errorMessage = 'Google 登入配置錯誤：OAuth 客戶端未找到，請聯繫管理員檢查設定';
    } else if (error?.error) {
      errorMessage = `Google 登入錯誤：${error.error}`;
    }
    
    setLoginError(errorMessage);
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm" 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom color="primary">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Sign In'
            )}
          </Button>

          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {googleLoading ? (
                <CircularProgress />
              ) : process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              ) : (
                <Alert severity="warning" sx={{ width: '100%' }}>
                  Google 登入功能未配置，請使用帳號密碼登入
                </Alert>
              )}
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Demo credentials: <br />
              Email: user@example.com <br />
              Password: password
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;