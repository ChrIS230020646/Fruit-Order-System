import React, { useState } from 'react';
import DeliveriesTable from './deliveriesTable';
import EditDelivery from './EditDelivery';

const ParentComponent = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'edit'
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleEditDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedDelivery(null);
  };

  const handleSaveDelivery = (updatedDelivery) => {
    console.log('Delivery updated:', updatedDelivery);
    // Refresh the table data if needed
    handleBackToList();
  };

  const handleDeliveryDeleted = (deliveryId) => {
    console.log('Delivery deleted:', deliveryId);
    // Refresh the table data if needed
  };

  return (
    <div>
      {currentView === 'list' ? (
        <DeliveriesTable
          onEditDelivery={handleEditDelivery}
          onDeliveryDeleted={handleDeliveryDeleted}
        />
      ) : (
        <EditDelivery 
          deliveryData={selectedDelivery}
          onBack={handleBackToList}
          onSave={handleSaveDelivery}
        />
      )}
    </div>
  );
};

export default ParentComponent;