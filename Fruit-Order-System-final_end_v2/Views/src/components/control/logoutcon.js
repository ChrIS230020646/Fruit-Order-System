const LogoutControl = ({ onLogout }) => {
      const handleLogout = () => {
    getEmail.clearEmail();
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.reload();
    }
  };
}