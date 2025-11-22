
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
    try {
      const result = await GetApi.postAPI('/staff/login', { email, password });
      return result;
    } catch (error) {
      console.error('login false:', error);
      return { success: false, error: 'wet error' };
    }
  }

  
  static async logout() {
    try {
      const result = await GetApi.postAPI('/auth/logout');
      return result;
    } catch (error) {
      console.error('login false:', error);
      return { success: false, error: 'wet error' };
    }
  }
}

export default AuthService;