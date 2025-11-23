export const getFruitColor = (fruit) => {
  const colors = {
    apple: '#ff4444',
    orange: '#ffa726',
    banana: '#ffd54f',
    grape: '#7e57c2',
    mango: '#ff9800',
    strawberry: '#f06292',
    watermelon: '#4caf50',
    pineapple: '#fbc02d',
    peach: '#ffb74d',
    pear: '#cddc39'
  };
  return colors[fruit] || '#757575';
};


export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

export const calculatePercentage = (part, total) => {
  return total > 0 ? ((part / total) * 100).toFixed(1) : 0;
};