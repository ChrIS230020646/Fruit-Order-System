# Fruit-Order-System
A simple fruit ordering system using the MERN stack.

# run npm
# 1.
cd js_server && npm install && cd ../Views && npm install && cd .. && npm install concurrently
# 2.
npx concurrently "cd js_server && node server.js" "cd Views && npm start"

# API Testing Commands (Production - Render)

## 1. GET - Get all fruits
```cmd
curl -X GET https://fruit-order-system-1.onrender.com/fruits
```

## 2. POST - Create new fruit

### Method 1: Using file (Recommended)
```cmd
echo {"fruitsArray": [{"_id": 8888, "name": "Apple", "originCountryId": 1, "price": 5.50, "unit": "kg", "description": "Fresh red apples"}]} > post_data.json
curl -X POST https://fruit-order-system-1.onrender.com/fruits -H "Content-Type: application/json" -d @post_data.json
```

### Method 2: Direct input
```cmd
curl -X POST https://fruit-order-system-1.onrender.com/fruits -H "Content-Type: application/json" -d "{\"fruitsArray\": [{\"_id\": 8888, \"name\": \"Apple\", \"originCountryId\": 1, \"price\": 5.50, \"unit\": \"kg\", \"description\": \"Fresh red apples\"}]}"
```

## 3. PUT - Update fruit

### Method 1: Using file (Recommended)
```cmd
echo {"name": "Green Apple", "originCountryId": 1, "price": 6.00} > put_data.json
curl -X PUT https://fruit-order-system-1.onrender.com/fruits/8888 -H "Content-Type: application/json" -d @put_data.json
```

### Method 2: Direct input
```cmd
curl -X PUT https://fruit-order-system-1.onrender.com/fruits/8888 -H "Content-Type: application/json" -d "{\"name\": \"Green Apple\", \"originCountryId\": 1, \"price\": 6.00}"
```

## 4. DELETE - Delete fruit
```cmd
curl -X DELETE https://fruit-order-system-1.onrender.com/fruits/8888
```

## 5. Clean up temporary files (Optional)
```cmd
del post_data.json put_data.json
```

---

# API Testing Commands (Local Development)

## 1. Show the list
```bash
curl -X GET http://localhost:3020/deliveries/list
```

## 2. INSERT with _id: 123456
```bash
curl -X POST http://localhost:3020/deliveries/insert \
  -H "Content-Type: application/json" \
  -d '{
    "_id": 123456,
    "fromWarehouseId": 1001,
    "toLocationId": 1002,
    "fruitId": 1,
    "quantity": 240,
    "deliveryDate": "2023-04-03",
    "estimatedArrivalDate": "2023-04-04",
    "status": "Delivered"
  }'
```

## 3. UPDATE the record
```bash
curl -X PUT http://localhost:3020/deliveries/update/123456 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Transit",
    "quantity": 300
  }'
```

## 4. DELETE the record
```bash
curl -X DELETE http://localhost:3020/deliveries/delete/123456
```
