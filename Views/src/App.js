import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage';
import ResponsiveLayout from './components/ResponsiveLayout';
import AuthService from './utils/auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AuthService.checkAuthStatus();
        setIsLoggedIn(authStatus.isLoggedIn);
        setUserEmail(authStatus.email || '');
      } catch (error) {
        console.error('chack false:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    const checkAfterLogin = async () => {
      const authStatus = await AuthService.checkAuthStatus();
      setIsLoggedIn(authStatus.isLoggedIn);
      setUserEmail(authStatus.email || '');
    };
    checkAfterLogin();
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsLoggedIn(false);
      setUserEmail('');
    } catch (error) {
      console.error('login falsex:', error);
      setIsLoggedIn(false);
      setUserEmail('');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  
  if (!googleClientId) {
    console.warn('Google Client ID is not configured. Google Login will not work.');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <div>
        {isLoggedIn ? (
          <ResponsiveLayout 
            userEmail={userEmail}
            onLogout={handleLogout} 
          />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;