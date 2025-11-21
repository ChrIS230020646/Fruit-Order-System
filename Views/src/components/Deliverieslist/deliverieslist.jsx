
import React, { useState } from 'react';
import DeliveriesTable from './deliveriesTable';
import OnEditDelivery from './onEditDelivery';

const ParentComponent = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleEditDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setEditDialogOpen(true);
  };

  const handleSaveDelivery = (updatedDelivery) => {
    console.log('Delivery updated:', updatedDelivery);


  };

  const handleDeliveryDeleted = (deliveryId) => {
    console.log('Delivery deleted:', deliveryId);

  };

  return (
    <div>
      <DeliveriesTable
        onEditDelivery={handleEditDelivery}
        onDeliveryDeleted={handleDeliveryDeleted}
      />
      
      <OnEditDelivery
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        delivery={selectedDelivery}
        onSave={handleSaveDelivery}
      />
    </div>
  );
};

export default ParentComponent;