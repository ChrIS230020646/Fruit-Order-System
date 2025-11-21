import React, { useState } from 'react';
import StaffTable from './StaffList';
import EditStaff from './EditStaff';

const StaffManagement = () => {
  const [currentView, setCurrentView] = useState('list'); 
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedStaff(null);
  };

  const handleSaveStaff = (staffData) => {
    console.log('Staff saved:', staffData);
    handleBackToList();
  };

  return (
    <div>
      {currentView === 'list' ? (
        <StaffTable onEditStaff={handleEditStaff} />
      ) : (
        <EditStaff 
          staffData={selectedStaff}
          onBack={handleBackToList}
          onSave={handleSaveStaff}
        />
      )}
    </div>
  );
};

export default StaffManagement;