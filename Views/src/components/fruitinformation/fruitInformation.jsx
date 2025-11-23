import React, { useState } from 'react';
import StickyHeadTable from './StickyHeadTable';
import Editfruit from './Editfruit';

const OrderManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'edit'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleEditfruit = (order) => {
    setSelectedOrder(order);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedOrder(null);
  };

  const handleSavefruit = (fruitData) => {
    console.log('Saving fruit:', fruitData);

    alert('Fruit saved successfully!');
    handleBackToList();
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '0 12px' }}>
      {currentView === 'list' ? (
        <StickyHeadTable onEditfruit={handleEditfruit} />
      ) : (
        <Editfruit 
          fruitData={selectedOrder}
          onBack={handleBackToList}
          onSave={handleSavefruit}
        />
      )}
    </div>
  );
};

export default OrderManagement;