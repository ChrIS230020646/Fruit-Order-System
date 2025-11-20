# Fruit-Order-System
A simple fruit ordering system using the MERN stack.

# run npm
# 1.
cd js_server && npm install && cd ../Views && npm install && cd .. && npm install concurrently
# 2.
npx concurrently "cd js_server && node server.js" "cd Views && npm start"

# 1. Show the list
curl -X GET http://localhost:3020/deliveries/list

 
# 2. INSERT with _id: 123456
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

# 3. UPDATE the record
curl -X PUT http://localhost:3020/deliveries/update/123456 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Transit",
    "quantity": 300
  }'

# 4. DELETE the record
curl -X DELETE http://localhost:3020/deliveries/delete/123456
