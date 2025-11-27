# Project info:
- **Fruit-Order-System**
  - A simple full-stack fruit ordering application built with the MERN stack (MongoDB, React, Node.js)
# Group info:
  - **Group no: 9**
  ## Students names:
  - **Chung Yat Ming (12992583)**
  - **Tse Cheuk Wa (12958473)**
  - **Man Ka Lok (13896396)**
  - **LIU Jiahong (13896612)**
  
# Project file intro:
## js_server
### js_server/server.js
- **Express.js**: Node.js web framework
- **Cookie Parser**: Handles HTTP cookies
- **MongoDB Database Connection**
- **Cross-Origin Request Handling**
- **Supports Multiple Frontend Domains**
- **Automatic Local Development Environment Detection**
- **CRUD Management System** covering multiple business modules
- **Serves both React Frontend and Express API** from the same server
- **Supports React Router Client-Side Routing**
- **API Requests** routed to corresponding backend endpoints
- **Page Requests** return React application's index.html
- **Security Features**
  - CORS Configuration: Controls cross-origin access
  - Environment Variables: Protects sensitive information
  - Google OAuth Authentication: Identity verification system

### js_server/orderBean
- Contains preset data templates that can be temporarily stored

### js_server/orderDB
- Controls database operations: read, delete, update, insert

### js_server/routes
- Exposes API endpoints for frontend connectivity

### js_server/package.json
- **Full-Stack Project** - Includes frontend build processes
- **Modern Configuration** - Uses environment variables and hot reloading
- **Authentication Integration** - Supports Google OAuth
- **Database Driven** - MongoDB data persistence
- **Development Friendly** - Distinguishes between development and production environments

## Views
### Views/src/components
- User Interface components

### Views/src/utils/auth.js
- Controls login routing paths

### Views/src/components/GetAPI/Getapi.js
- Connects to and consumes backend APIs

### Views/package-lock.json
**Technology Stack Characteristics:**
1. **Modern Frontend Stack**
   - React 19 + Material-UI + React Router
   - Enterprise-grade technology choices

2. **Complete Development Experience**
   - Built-in testing configuration
   - Code quality linting
   - Performance monitoring

3. **Rich Feature Integration**
   - Chart displays (Recharts)
   - Google Login (OAuth)
   - Responsive design (MUI)

4. **Production Ready**
   - Optimized build configuration
   - Browser compatibility handling
   - Performance monitoring integration

### Views/src/App.js
- **Login Status Management** - Controls user login/logout states
- **Google OAuth Integration** - Uses Google accounts for authentication
- **Conditional Rendering** - Displays different interfaces based on login status

### Views/src/index.js
- **Application Startup** - Mounts React components to the DOM
- **Root Component Rendering** - Initializes the entire application



# The cloud-based server URL:
```cmd
https://fruit-order-system-1.onrender.com/
```

# User Flow:
## run npm
## 1.
```cmd
cd js_server && npm install && cd ../Views && npm install && cd .. && npm install concurrently
```
## 2.
```cmd
npx concurrently "cd js_server && node server.js" "cd Views && npm start"
```

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
