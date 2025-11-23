
class GetEmail {
  constructor() {
    this.userEmail = this.loadEmailFromSession();
    this.userData = this.loadUserDataFromSession();
  }

  
  loadEmailFromSession() {
    if (typeof window === 'undefined') return '';
    
    try {
      return sessionStorage.getItem('userEmail') || '';
    } catch (error) {
      console.error('Error loading email from sessionStorage:', error);
      return '';
    }
  }

  
  loadUserDataFromSession() {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = sessionStorage.getItem('userData');
      return userData ? JSON.parse(userData) : this.getMockUserData();
    } catch (error) {
      console.error('Error loading user data from sessionStorage:', error);
      return this.getMockUserData();
    }
  }

  
  getMockUserData() {
    return {
      _id: 1,
      name: "John Smith",
      email: this.userEmail || "",
      phone: "1234567890",
      job: "manager",
      location: "123 Main St, New York",
      status: true
    };
  }

  
  setEmail(email) {
    if (typeof window === 'undefined') return false;
    
    try {
      sessionStorage.setItem('userEmail', email);
      this.userEmail = email;
      
      
      const userData = this.getMockUserData();
      userData.email = email;
      sessionStorage.setItem('userData', JSON.stringify(userData));
      this.userData = userData;
      
      console.log('Email saved to session:', email);
      return true;
    } catch (error) {
      console.error('Error saving email to sessionStorage:', error);
      return false;
    }
  }

  
  GetEmail() {
    return this.userEmail;
  }

  
  getUserData() {
    return this.userData;
  }

  
  isLoggedIn() {
    return this.userEmail !== '';
  }

  
  clearEmail() {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userData');
      this.userEmail = '';
      this.userData = null;
      console.log('Email cleared from session');
    } catch (error) {
      console.error('Error clearing email from sessionStorage:', error);
    }
  }
}


const getEmail = new GetEmail();

export default getEmail;