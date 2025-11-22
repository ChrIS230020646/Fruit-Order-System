// src/components/profile/profile.jsx
import React, { useState } from 'react'; 
import ResponsiveLayout from './information';
import EditStaff from './EditStaff';

const Profile = () => {
  const [currentView, setCurrentView] = useState('information');

  
  const handleEditInformation = () => {
    setCurrentView('edit');
  };

  
  const handleSave = () => {
    setCurrentView('information');
    
  };

  
  const handleCancel = () => {
    setCurrentView('information');
  };

  return (
    <div>
      {currentView === 'information' ? (
        <ResponsiveLayout onEditInformation={handleEditInformation} />
      ) : (
        <EditStaff onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default Profile; 