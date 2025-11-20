import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ResponsiveLayout from './components/ResponsiveLayout';
import AuthService from './utils/auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AuthService.checkAuthStatus();
        setIsLoggedIn(authStatus.isLoggedIn);
        setUserEmail(authStatus.email || '');
      } catch (error) {
        console.error('认证检查失败:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    // 登录成功后重新检查认证状态
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
      console.error('登出失败:', error);
      setIsLoggedIn(false);
      setUserEmail('');
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
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
  );
};

export default App;