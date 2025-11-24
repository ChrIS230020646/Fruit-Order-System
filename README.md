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
```cmd
curl -X POST https://fruit-order-system-1.onrender.com/fruits -H "Content-Type: application/json" -d "{\"fruitsArray\": [{\"_id\": 8888, \"name\": \"Apple\", \"originCountryId\": 1, \"price\": 5.50, \"unit\": \"kg\", \"description\": \"Fresh red apples\"}]}"
```

## 3. PUT - Update fruit
```cmd
curl -X PUT https://fruit-order-system-1.onrender.com/fruits/8888 -H "Content-Type: application/json" -d "{\"name\": \"Green Apple\", \"originCountryId\": 1, \"price\": 6.00}"
```

## 4. DELETE - Delete fruit
```cmd
curl -X DELETE https://fruit-order-system-1.onrender.com/fruits/8888
```

---

# API Testing Commands (Local Development)

## 1. GET - Get all fruits
```cmd
curl -X GET http://localhost:3020/fruits
```

## 2. POST - Create new fruit
```cmd
curl -X POST http://localhost:3020/fruits -H "Content-Type: application/json" -d "{\"fruitsArray\": [{\"_id\": 8888, \"name\": \"Apple\", \"originCountryId\": 1, \"price\": 5.50, \"unit\": \"kg\", \"description\": \"Fresh red apples\"}]}"
```

## 3. PUT - Update fruit
```cmd
curl -X PUT http://localhost:3020/fruits/8888 -H "Content-Type: application/json" -d "{\"name\": \"Green Apple\", \"originCountryId\": 1, \"price\": 6.00}"
```

## 4. DELETE - Delete fruit
```cmd
curl -X DELETE http://localhost:3020/fruits/8888
```
