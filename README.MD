# ST2515: Secure Coding 2023/2024 Semester 2 Assignment 1

Application of code analysis and web penetration skills to ensure secure coding practices in a web project. The provided web project contains source codes that require thorough analysis. The task is to deploy and test the web application, review its source codes, and identify any potential security vulnerabilities.

# TODO 

Use tools

# Usage

Windows, ```./start.bat```

# Notes 

What category does allowing -97 products fall under? Maybe 

Categories of OWASP TOP 10 2021:
A01 Broken Access Control (1/2)
A02 Cryptographic failure (2/2)
A03 Injection (2/2)
A04 Insecure Design 
A07 Identification and Authentication failures (2/2)
A08 Software and Data Integrity Failures
A09 Security Logging and Monitoring Failures 


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

> :fire: **Critical:** A3 (detailed): Inserted data is not validated, and html elements can be stored in database, potentially resulting in stored XSS


### 4. PUT /product/:productid
### 5. DELETE /review/:reviewid
> :fire: **Critical:** A3: SQLi 
### 12. PUT /users/:id
### 13. POST /category
### 15. POST /product
### 17. DELETE /product/:id
### 18. POST /product/:id/review
### 20. POST /discount/:productid
### 23. POST /product/:id/image

### Without verifyToken middleware

### 6. GET /product/brand/:brand

Looks good, viewing by brand is not sensitive

### 7. GET /product

Looks good, products are public view

### 8. POST /user/login

Has no token verification as this is to login. 

> :fire: **Critical** A7 (brief): Permits brute force or other automated attacks. Can lead to privilege escalation. Brute force success chance is also lowered due to weak password policy. See Endpoint 9 A7

Resolution by adding a rate limiter
```bash
npm install express-rate-limit
```
./BackEnd/app.js
```js
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiter to all requests
app.use(limiter);

```

### 9. POST /users
> :fire: **Critical:** A3 (detailed, continued): Inserted data is not validated, and html elements can be stored in database, potentially resulting in stored XSS. This username is displayed when the reviews pull the name and browser reflects it without output sanitization

> :warning: **Warning:** A7 (detailed): No password policy is enforced, even if hashing (currently not implemented, see Cryptography section below) is implemented, the passwords can be cracked through rainbow tables. Another risk is the increased chance of a brute force attack if users use common passwords. See Endpoint 8 A7



### 10. GET /users

> :fire: **Critical:** A1: Accessing API with missing access controls for POST, PUT and DELETE. This endpoint has no user validation, therefore anyone can view all users as long as they make a request to this endpoint. This exposes userid, username, email, contact, type, profile_pic_url, created_at. These even include the admin users and therefore VERTICAL PRIVILEGE ESCALATION
> only for review.js, others are all jwt validated

To view the admin page before it redirects
```bash
cutycapt --url=http://hostname:3001/admin.html --delay=200 --out=admin200.png
```

To view the admin page source code to view endpoints
```bash
python ./exploit_demos/admin.py
```

Resolution is to use middleware before serving the page
```js
const express = require('express');
const path = require('path');
const verifyToken = require('../auth/verifyToken.js');

const app = express();

const protectedRoutesMiddleware = (req, res, next) => {
    const protectedRoutes = ['/admin', '/dashboard'];
    if (protectedRoutes.some(route => req.path.startsWith(route))) {
        return verifyToken(req, res, next);
    }
    next();
};

app.use(protectedRoutesMiddleware);
app.use(express.static(path.join(__dirname, "public"))); // Legacy line
```

Unknown use for this endpoint. Very sensitive, shows passwords in plain

This exposes userid, username, email, contact, type, profile_pic_url, created_at. These can then tell malicious third parties who the admins are. Risk of vertical privilege escalation is increased. A demonstration of this vulnerability can be done by running ./exploit_demos/admin.py

### 11. GET /users/:id
### 14. GET /category
### 16. GET /product/:id

> :fire: **Critical:** A3 (brief): Blind SQLi. Medium risk as the injected code cannot escape the GROUP BY p.productid statement and therefore will need to work around it. Current found payload can output only the last row of any table. 

Blind sqli guessing the tables
```sql
8 GROUP BY p.productid UNION SELECT null, null, null, null, null, null, null, null, null, p.productid, table_schema, table_name FROM INFORMATION_SCHEMA.TABLES, product p WHERE table_name = 'user'
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

> :information: **Information** 
admin.html is protected by an inline script, however it exposes some admin endpoints as users can capture the . These admin endpoints should therefore not overlook any security

## Cryptography 

> :warning: **Caution:** A2: All passwords stored in the mySQL instance are not hashed
Confirmed to be classified as a vulnerability
> :warning: **Caution:** A2: Uses HTTP protocol and is susceptible to MITM

