# ST2515: Secure Coding 2023/2024 Semester 2 Assignment 1

Application of code analysis and web penetration skills to ensure secure coding practices in a web project. The provided web project contains source codes that require thorough analysis. The task is to deploy and test the web application, review its source codes, and identify any potential security vulnerabilities.

# TODO 

Use tools

# Usage

Windows, in two cmd/powershell instances: ```node ./BackEnd/server.js``` && ```node ./FrontEnd/server.js```

# Notes 

## Endpoints

### 1. POST /user/isloggedin
only some if statements to check data, no RWX
### 2. GET /order/:userid
req.userid SELECT, SQL is prepared
### 3. POST /order
Optional chaining 
```
object?.property
``` 
This operator allows you to safely access properties of an object without causing an error if the object is null or undefined. 

SELECT, INSERT, both prepared. 

> :fire: **Critical:** Inserted data is not validated, and html elements can be stored in database, potentially resulting in stored XSS


### 4. PUT /product/:productid
### 5. DELETE /review/:reviewid
### 12. PUT /users/:id
### 13. POST /category
### 15. POST /product
### 17. DELETE /product/:id
### 18. POST /product/:id/review
### 20. POST /discount/:productid
### 23. POST /product/:id/image

### Without verifyToken middleware

### 6. GET /product/brand/:brand
### 7. GET /product
### 8. POST /user/login
### 9. POST /users
### 10. GET /users
### 11. GET /users/:id
### 14. GET /category
### 16. GET /product/:id
### 19. GET /product/:id/reviews
### 21. GET /discount
### 22. GET /discount/:id
### 24. GET /product/:id/image
### 25. GET /product/cheapest/:categoryid