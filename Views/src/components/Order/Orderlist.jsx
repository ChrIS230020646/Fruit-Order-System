// src/components/Order/Orderlist.jsx
import React, { useState } from 'react';
import InventoryTable from './StickyHeadTable';
import EditInventory from './EditOrder';

const InventoryManagement = () => {
  const [currentView, setCurrentView] = useState('list'); 
  const [selectedInventory, setSelectedInventory] = useState(null);

  const handleEditInventory = (inventory) => {
    setSelectedInventory(inventory);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedInventory(null);
  };

  const handleSaveInventory = (inventoryData) => {
    console.log('Inventory saved:', inventoryData);
    
    
    handleBackToList();
  };

  return (
    <div>
      {currentView === 'list' ? (
        <InventoryTable onEditInventory={handleEditInventory} />
      ) : (
        <EditInventory 
          inventoryData={selectedInventory}
          onBack={handleBackToList}
          onSave={handleSaveInventory}
        />
      )}
    </div>
  );
};

export default InventoryManagement;