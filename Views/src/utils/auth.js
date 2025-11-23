import GetApi from '../components/GetAPI/Getapi';

class AuthService {
  
  static async checkAuthStatus() {
    try {
      const result = await GetApi.getAPI('/auth/check');
      return result;
    } catch (error) {
      console.error('check not find:', error);
      return { success: false, isLoggedIn: false };
    }
  }

  
  static async login(email, password) {
    const result = await GetApi.postAPI('/staff/login', { email, password });
    
    // GetApi.postAPI 不會拋出錯誤，而是返回 { success: false }
    // 直接返回結果，保留後端的詳細錯誤訊息
    if (!result.success) {
      console.error('Login failed:', result.error);
      return result;
    }
    
    return result;
  }

  
  static async googleLogin(credential) {
    const result = await GetApi.postAPI('/staff/google-login', { credential });
    
    // GetApi.postAPI 不會拋出錯誤，而是返回 { success: false }
    // 直接返回結果，保留後端的詳細錯誤訊息
    if (!result.success) {
      console.error('Google login failed:', result.error);
      return result;
    }
    
    return result;
  }

  
  static async logout() {
    const result = await GetApi.postAPI('/auth/logout');
    
    // GetApi.postAPI 不會拋出錯誤，而是返回 { success: false }
    // 直接返回結果，保留後端的詳細錯誤訊息
    if (!result.success) {
      console.error('Logout failed:', result.error);
      return result;
    }
    
    return result;
  }
}

export default AuthService;