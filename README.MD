# ST2515: Secure Coding 2023/2024 Semester 2 Assignment 1

Application of code analysis and web penetration skills to ensure secure coding practices in a web project. The provided web project contains source codes that require thorough analysis. The task is to deploy and test the web application, review its source codes, and identify any potential security vulnerabilities.

# Usage

Windows, in two cmd/powershell instances: ```node ./BackEnd/server.js``` && ```node ./FrontEnd/server.js```

# Notes 

### Endpoints

With verifyToken middleware
```
POST /user/isloggedin
GET /order/:userid
POST /order
PUT /product/:productid
DELETE /review/:reviewid
```
Without verifyToken middleware
```
GET /product/brand/:brand
GET /product
POST /user/login
```

WHY DO THEY SAY THESE ARE THE REAL ENDPOINTS
No middleware
```
POST /users
GET /users
GET /users/:id
GET /category
GET /product/:id
POST /product/:id/review
GET /product/:id/reviews
GET /discount
GET /discount/:id
GET /product/:id/image
GET /product/cheapest/:categoryid
```
With middleware
```
PUT /users/:id
POST /category
DELETE /product/:id
POST /product/:id/review
POST /discount/:productid
POST /product/:id/image
```