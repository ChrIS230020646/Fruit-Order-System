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
    
    // The `GetApi.postAPI` method will not throw an error; instead, it will return `{ success: false }`.
    // Return the result directly, retaining detailed error messages from the backend.
    if (!result.success) {
      console.error('Login failed:', result.error);
      return result;
    }
    
    return result;
  }

  
  static async googleLogin(credential) {
    const result = await GetApi.postAPI('/staff/google-login', { credential });
    
    // The `GetApi.postAPI` method will not throw an error; instead, it will return `{ success: false }`.
    // Return the result directly, retaining detailed error messages from the backend.
    if (!result.success) {
      console.error('Google login failed:', result.error);
      return result;
    }
    
    return result;
  }

  
  static async logout() {
    const result = await GetApi.postAPI('/auth/logout');
    
    // The `GetApi.postAPI` method will not throw an error; instead, it will return `{ success: false }`.
    // Return the result directly, retaining detailed error messages from the backend.
    if (!result.success) {
      console.error('Logout failed:', result.error);
      return result;
    }
    
    return result;
  }
}

export default AuthService;