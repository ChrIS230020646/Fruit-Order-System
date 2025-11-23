# Fruit-Order-System
A simple fruit ordering system using the MERN stack.

# run npm
# 1.
cd js_server && npm install && cd ../Views && npm install && cd .. && npm install concurrently
# 2.
npx concurrently "cd js_server && node server.js" "cd Views && npm start"

# API Testing Commands (Production - Render)

## 1. Show the list
```cmd
curl -X GET https://fruit-order-system-1.onrender.com/deliveries/list
```

## 2. INSERT with _id: 123456
```cmd
curl -X POST https://fruit-order-system-1.onrender.com/deliveries/insert -H "Content-Type: application/json" -d "{\"_id\": 123456, \"fromWarehouseId\": 1001, \"toLocationId\": 1002, \"fruitId\": 1, \"quantity\": 240, \"deliveryDate\": \"2023-04-03\", \"estimatedArrivalDate\": \"2023-04-04\", \"status\": \"Delivered\"}"
```

## 3. UPDATE the record
```cmd
curl -X PUT https://fruit-order-system-1.onrender.com/deliveries/update/123456 -H "Content-Type: application/json" -d "{\"status\": \"In Transit\", \"quantity\": 300}"
```

## 4. DELETE the record
```cmd
curl -X DELETE https://fruit-order-system-1.onrender.com/deliveries/delete/123456
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
