# ST2515: Secure Coding 2023/2024 Semester 2 Assignment 1

Application of code analysis and web penetration skills to ensure secure coding practices in a web project. The provided web project contains source codes that require thorough analysis. The task is to deploy and test the web application, review its source codes, and identify any potential security vulnerabilities.

# Usage

Windows, in two cmd/powershell instances: ```node ./BackEnd/server.js``` && ```node ./FrontEnd/server.js```

# Notes 

### Endpoints

With verifyToken middleware
```
1. POST /user/isloggedin
2. GET /order/:userid
3. POST /order
4. PUT /product/:productid
5. DELETE /review/:reviewid
12. PUT /users/:id
13. POST /category
15. POST /product
17. DELETE /product/:id
18. POST /product/:id/review
20. POST /discount/:productid
POST /product/:id/image
```
Without verifyToken middleware
```
6. GET /product/brand/:brand
7. GET /product
8. POST /user/login
9. POST /users
10. GET /users
11. GET /users/:id
14. GET /category
16. GET /product/:id
19.GET /product/:id/reviews
21. GET /discount
22. GET /discount/:id
GET /product/:id/image
GET /product/cheapest/:categoryid
```