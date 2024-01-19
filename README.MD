# ST2515: Secure Coding 2023/2024 Semester 2 Assignment 1

Application of code analysis and web penetration skills to ensure secure coding practices in a web project. The provided web project contains source codes that require thorough analysis. The task is to deploy and test the web application, review its source codes, and identify any potential security vulnerabilities.

# TODO 

Use tools

# Usage

Windows, in two cmd/powershell instances: ```node ./BackEnd/server.js``` && ```node ./FrontEnd/server.js```

# Notes 

Categories of OWASP TOP 10 2021:
A03 Injection


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
> :fire: **Critical:** A3: Inserted data is not validated, and html elements can be stored in database, potentially resulting in stored XSS. This username is displayed when the reviews pull the name and browser reflects it without output sanitization

### 10. GET /users

Unknown use for this endpoint. Very sensitive, shows passwords in plain

> :fire: **Critical:** A1: Accessing API with missing access controls for POST, PUT and DELETE. This endpoint has no user validation, therefore anyone can view all users as long as they make a request to this endpoint. 

This exposes userid, username, email, contact, type, profile_pic_url, created_at. These can then tell malicious third parties who the admins are. Risk of vertical privilege escalation is increased. A demonstration of this vulnerability can be done by running ./

### 11. GET /users/:id
### 14. GET /category
### 16. GET /product/:id

> :fire: **Critical:** A3: SQLi

Payload: 
```sql
8 OR 1=1 GROUP BY p.productid UNION SELECT u.username, u.password, u.type, u.email, null, null, null, null, null, p.productid, table_schema, table_name FROM INFORMATION_SCHEMA.TABLES, user u, product p
```

http://localhost:8081/product/8%20GROUP%20BY%20p.productid%20UNION%20SELECT%20null,%20null,%20null,%20null,%20null,%20null,%20null,%20null,%20null,%20p.productid,%20table_schema,%20table_name%20FROM%20INFORMATION_SCHEMA.TABLES,%20product%20p
### 19. GET /product/:id/reviews
> :warning: **Caution:** No output sanitisation, risk is displaying stored XSS

### 21. GET /discount
### 22. GET /discount/:id
### 24. GET /product/:id/image
### 25. GET /product/cheapest/:categoryid

## Pages

### admin.html 

admin.html is protected by an inline script, however it exposes some admin endpoints as users can capture the . These admin endpoints should therefore not overlook any security

## Cryptography 

:warning: **Caution:** All passwords stored in the mySQL instance are not hashed

