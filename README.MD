# ST2515: Secure Coding 2023/2024 Semester 2 Assignment 1

Application of code analysis and web penetration skills to ensure secure coding practices in a web project. The provided web project contains source codes that require thorough analysis. The task is to deploy and test the web application, review its source codes, and identify any potential security vulnerabilities.

# TODO 

Use tools

# Usage

Windows, ```./start.bat```

# Notes 

What category does allowing -97 products fall under? Maybe 

Categories of OWASP TOP 10 2021:
A01 Broken Access Control (2/2)
A02 Cryptographic failure (2/2)
A03 Injection (6/2)
A04 Insecure Design (7/2)
A07 Identification and Authentication failures (2/2)

## Endpoints

### 1. POST /user/isloggedin
only some if statements to check data, no RWX
### 2. GET /order/:userid
req.userid SELECT, SQL is prepared
### 3. POST /order
> [!INFORMATION] Optional chaining 
```
object?.property
``` 
This operator allows you to safely access properties of an object without causing an error if the object is null or undefined. 

SELECT, INSERT, both prepared. 

> :fire: **Critical:** A3 (detailed): Inserted data is not validated, and html elements can be stored in database, potentially resulting in stored XSS



### 4. PUT /product/:productid

> :fire: **Critical** A1 (detailed): This is a highly sensitive endpoint that only users with the highest privilege should access. It has been found that all users with a valid token can successfully make a request to this endpoint

Resolution, create another middleware function to validate an admin token (can just add a bool parameter to switch mode in verifytoken but a lot of calling changes)
```js
function verifyTokenAdmin(req, res, next) {
    var token = req.headers['authorization']; 

    if (!token || !token.includes('Bearer')) { 
        res.status(403);
		return res.send({ auth: 'false', message: 'Not authorized!' });
    } else {
        token = token.split('Bearer ')[1];
        jwt.verify(token, config.key, function (err, decoded) { 
            if (err || decoded.type != 'Admin') { // Add another condition: if not admin, HTTP 403
                res.status(403);
                return res.json({ auth: false, message: 'Not authorized!' });
            } else {
                req.userid = decoded.userid; //decode the userid and store in req for use
                req.type = decoded.type; //decode the role and store in req for use
                next();
            }
        });
    }
}
```

### 5. DELETE /review/:reviewid
> :fire: **Critical:** A3 (brief2): SQLi 

> [!WARNING]  A1 (detailed, continued): See A1 Endpoint 4. The impact of this broken access is that any user's reviews can be deleted

Review id:
```sql
8 OR 1=1
```

User id is decoded using JWT, unless the JWT can be forged, the user id cannot be changed. Therefore the risk is somewhat low as the maximum risk is the user deleting all of their own reviews

### 12. PUT /users/:id

> :warning: **Warning:**: A4 (detailed): This endpoint can accept requests from anyone with a valid token, while this endpoint was intended only for admins to use. Risk is high as other users can modify other user's information, including passwords

### 13. POST /category

> :warning: **Warning:**: A4 (detailed): This endpoint can accept requests from anyone with a valid token, while this endpoint was intended only for admins to use. Risk is high as categories can be added and lead to XSS if they are displayed

### 15. POST /product

> :warning: **Warning:**: A4 (detailed): This endpoint can accept requests from anyone with a valid token, while this endpoint was intended only for admins to use. Risk is high as registered users can post new products

### 17. DELETE /product/:id

> :fire: **Critical:**: A4 (detailed): This endpoint can accept requests from anyone with a valid token, while this endpoint was intended only for admins to use. Risk is critical as registered users can delete products and risk the availability and all incoming business operations

### 18. POST /product/:id/review

> [!Warning] A3 (brief3): SQLi. Has low risk due to nature of SQL statement.

### 20. POST /discount/:productid

> :warning: **Warning:**: A4 (detailed): This endpoint can accept requests from anyone with a valid token, while this endpoint was intended only for admins to use.

### 23. POST /product/:id/image

> :warning: **Warning:**: A4 (detailed): This endpoint can accept requests from anyone with a valid token, while this endpoint was intended only for admins to use.

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

Resolution is to whitelist input, escape them from html characters and sanitise output in endpoints where it returns stored data. Can use the [Validator]() module 
```bash
npm install validator
```
Example of escaping:
```js
const validator = require('validator');

// Api no. 9 Endpoint: POST /users/ | Add new user
app.post("/users", (req, res) => {
    //...
    username = validator.escape(username);
    email = validator.escape(email);
    contact = validator.escape(contact);
    userDB.addNewUser(
        username, email, contact, password, "Customer", profile_pic_url,
        //...
    );
});
```
Example of whitelisting:
```js
const validator = require('validator');

//...
if (!validator.isEmail(email)) {
    res.status(422).json({ message: "Invalid email address" });
    return;
}
```


> :warning: **Warning:** A7 (detailed): No password policy is enforced, even if hashing (currently not implemented, see Cryptography section below) is implemented, the passwords can be cracked through rainbow tables. Another risk is the increased chance of a brute force attack if users use common passwords. See Endpoint 8 A7

To implement a password policy
```js
const passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

if (!passwordValidator.test(password)) {
    return res.status(422).json({
        message: "Password must contain at least 8 characters, including one letter and one digit.",
    });
}
```

### 10. GET /users

> :fire: **Critical:** A1 (detailed, this doesnt have any middleware): Accessing API with missing access controls for POST, PUT and DELETE. This endpoint has no user validation, therefore anyone can view all users as long as they make a request to this endpoint. This exposes userid, username, email, contact, type, profile_pic_url, created_at. These even include the admin users and result in vertical privilege escalation.

To view the admin page before it redirects
```bash
cutycapt --url=http://hostname:3001/admin.html --delay=200 --out=admin200.png
```

To view the admin page source code to view endpoints. Here we use the requests module from python as we are only interested in reading the raw HTML source. Using a browser will execute it and therefore redirect us to the front page as we are not authenticated as an administrator
```bash
python ./exploit_demos/admin.py
```
Resolution, create another middleware function to validate an admin token, see Endpoint 4 A1

### 11. GET /users/:id

> :warning: **Warning:**: A4 (detailed): Since this endpoint can accept requests from anyone regardless of their userid, users can request for the user data of other users. Malicious threat actors can steal user data by making continuous requests to this endpoint and incrementing their id argument by 1 for each request.

> [!Information] 2021:A04 - An insecure design cannot be fixed by a perfect implementation as by definition, needed security controls were never created to defend against specific attacks. This endpoint only contains the verifytoken middleware but it is not sufficient.

Exploit demo: ./exploit_demos/incremental_req.py

Resolution: on server side check the user's token and decode it, and only use the userid that is provided in the user token. The parameter field can be modified and therefore cannot be trusted

We see that the JWT token has already been included in the request so therefore no additions are needed for front end. However it would be useful if we removed the workflow of getting the userid from the local storage as we have decided that we would not trust the userid URL parameter, therefore this step would be rendered useless 
```js
// ./FrontEnd/public/userprofile.html

var token = localStorage.getItem("JWT");
    var userInfo = localStorage.getItem("User")
    let userId = -1

    function editUser() {
        axios.get(`http://localhost:8081/users/${userId}`, {
            headers: { 'authorization': 'Bearer ' + token }
        }).then(({ data: userData }) => {
            const { contact, email, profile_pic_url, username } = userData
            $("#editUsername").val(username)
            $("#editEmail").val(email)
            $("#editContact").val(contact)
            $("#editProfilePic").val(profile_pic_url)
        }).catch((err) => console.log(err));
    }
```

On the server side, we should check if the token is valid by simply adding the existing middleware to verify that any decoded data can be trusted and use only the userid from decoding this
```js
var verifyToken = require("../auth/verifyToken.js");

app.get("/users/:id", verifyToken, (req, res) => {
    // req.userid = decoded.userid
    userDB.getUser(req.userid, (err, results) => {});
});
```
### 14. GET /category
### 16. GET /product/:id

> :fire: **Critical:** A3 (brief): SQLi. The risk is the confidientiality of all information stored in the store's MySQL instance

Emotional damage
```sql
1 UNION SELECT null, o.userid, o.cart, o.total, u.username, u.email, u.contact, u.password, u.type, u.profile_pic_url, i.table_name, i.table_schema FROM user u, INFORMATION_SCHEMA.TABLES i, orders o UNION SELECT null, null, null, null, null, null, null, null, null, p.productid, null, null FROM product p
```


Resolution is to use placeholders
```js
// ./BackEnd/models/product.js
getProduct: (productid, callback) => {
    var dbConn = db.getConnection();
    dbConn.connect(function (err) {
        if (err) {
            return callback(err, null);
        } else {
            dbConn.query(
                `select p.productid, p.name, p.description, c.categoryid, category categoryname, p.brand, 
                p.price, COUNT(distinct r.reviewid) reviewcount, 
                pi.path imagepath, AVG( r.rating) rating, d.discountid, d.discount_percentage 
                from product p join category c on c.categoryid = p.categoryid  
                left join reviews r on r.productid = p.productid
                left join productimages pi on pi.productid = p.productid 
                left join discount d on d.productid = p.productid 
                where p.productid = ?
                GROUP BY p.productid`, [productid], 
                function (err, results) {
                    // ...
                }
            );
        }
    });
},
```

http://localhost:8081/product/1%20UNION%20SELECT%20null,%20o.userid,%20o.cart,%20o.total,%20u.username,%20u.email,%20u.contact,%20u.password,%20u.type,%20u.profile_pic_url,%20i.table_name,%20i.table_schema%20FROM%20user%20u,%20INFORMATION_SCHEMA.TABLES%20i,%20orders%20o%20UNION%20SELECT%20null,%20null,%20null,%20null,%20null,%20null,%20null,%20null,%20null,%20p.productid,%20null,%20null%20FROM%20product%20p
S
### 19. GET /product/:id/reviews
> :warning: **Caution:** A3 (detailed, continued): No output sanitisation, risk is displaying stored XSS

### 21. GET /discount
### 22. GET /discount/:id
### 24. GET /product/:id/image
### 25. GET /product/cheapest/:categoryid

## Pages

### admin.html 

> [!IMPORTANT] A1 (brief, continued): admin.html is protected by an inline script, however it exposes some admin endpoints as users can capture the page source and even render it. These admin endpoints should therefore not overlook any security

## Cryptography 

> :warning: **Caution:** A2: All passwords stored in the mySQL instance are not hashed
Confirmed to be classified as a vulnerability
> :warning: **Caution:** A2: Uses HTTP protocol and is susceptible to MITM

