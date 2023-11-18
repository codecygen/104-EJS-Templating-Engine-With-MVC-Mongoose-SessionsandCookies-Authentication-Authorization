# Practice App

## Starting the app for the first time:

- npm i
- Create a database called "shopping-website" in MySQL
- Create .env file and provide the given content.

```javascript
# FOR MONGODB ATLAS
URL =
  "mongodb+srv://UserName:UserPass@ClusterName.b99wetu.mongodb.net/DBName?retryWrites=true&w=majority";

# FOR LOCAL MONGODB
# URL="mongodb://username:password@0.0.0.0:27017/shoppingDB"

EXPRESS_SESSION_KEY = "your-secret-key";

EMAIL=passwordresetemail@email.com
PASSWORD=password
```

- Start server with "npm start" command which will trigger "nodemon start".

## MVC Pattern (Model View Controller):

### Model:

- Responsible for representing your data.
- Responsible for managing your data (saving, fetching...).
- Does not matter if you manage data in memory, files, databases.
- Contains data related logic.

### View:

- What the users see.
- Should not contain too much logic (HTML, Handlebars, Pug, EJS...).

### Controller:

- Connects "Model" and "View".
- Responsible of establishing the communication of both in both directions.

## Model View Controller (MVC) in this Project

- The MVC pattern helps you break up the frontend and backend code into separate components.
- Model View Controller principles are applied in this project.
- There will be "views", "controllers" and "models" folders to make the project easier to divide into its related logical categories.
- "views" folder stores the front end data in it.
- "controllers" folder stores the specific route controlling functions. These functions are then exported into routes folder. They are basically the list of functions which controls the specific page's behaviors.
- "models" folder stores the "users.json" file which has all the usernames and user ages. These info is pulled by "/display/users" page.

# Notes:

- In "req.body.myFormInput", "myFormInput" is extracted from forms. You can also extract all form inputs with "req.body" only.
- In "req.params.myLink", "myLink" is extracted from the entered link. for example in "http://localhost:3000/:myLink", "myLink" is a dynamic link. For more info, check "router.get("/products/:productId", shopController.getProduct);" in the project. You can also extract all parameters with "req.params" only.
- "req.query.myQuery" gives the "myQuery" info. For example when we enter "http://localhost:3000/products?myQuery=true", "req.query.myQuery" will return "true". The extracted value will always be a string. For more info, refer to "router.get("/edit-product/:productId", adminController.editProduct);" in the project.

# Database (MongoDB):

- MongoDB is used for this project. "mongodb" and "uuidv4" packages are needed to be installed from "npm" for access to the database.

- environmental variables used for this project. I put these variables inside

```javascript
URL =
  "mongodb+srv://UserName:UserPass@ClusterName.b99wetu.mongodb.net/DBName?retryWrites=true&w=majority";
EXPRESS_SESSION_KEY = "your-secret-key";
```

- **Mongoose-Connect-Database** <br>
  Basically, **"./Model/database/dbConnection.js"** is used in **"./index.js"** to connect to database.
- **MongoDB-Create-And-Associate-Models** <br>
  **"./Model/database/dbAssociation.js"** is used in **./index.js** so that all model associations and models are properly set. We need to only import dbAssociations.js in index.js.
- **Express-Session-Keep-Cookie-in-req.session** <br>
  express-session is a package and it keeps some session files in it so the selected admin will be known by the system.
- **Mongoose-Queries**
  All query related info kept inside "/Model/tables/orderTable.js", "/Model/tables/productTable.js" and "/Model/tables/userTable.js".
- **Mongoose-Populate**
  This is a method that is supposed to work but I could not get it working in this project. Gives me null because I did not properly define it.

Also the following methods work with find, findOne, findById and findOneAndUpdate methods as stated in the picture down below.

![methods that work](https://github.com/codecygen/101-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose/blob/main/Images/164075580-a4e6fa11-cf0f-4f5f-9265-d065f6456a95.png?raw=true)

```javascript
const user = await User.findById(userId).populate("productId");

// Basically it says only show userName, userAge as a result
// but populate the productId section by pulling the _id of the Product model
// also only populate it with productName and no other details of that product.
const user = await User.findById(userId)
  .select("userName", "productId", "productName")
  .populate("productId", "productName");
```

**Solution:** it means here that productId is directing us to "\_id" field of Product Model. Basically it searches through User model and tries to find User.\_id === userId. Also populates the productId by finding Product.\_id === productId then puts all product details under that user as well.

# Sessions and Cookies:

## Cookies:

Some of the cookie attributes are given down below.

```javascript
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

exports.getLoginPage = async (req, res, next) => {
  // Gets cookie from front end with Get request for the page.
  // req.get("Cookie") will only return not expired cookies
  if (req.get("Cookie")) {
    console.log(req.get("Cookie"));
    console.log(req.cookies);
    // Output:
    // connect.sid=s%3AEc9Ke1LRkapkR1oCWsJhLAQ135sZJvip.FOzakumJ0zFCgJNOUdqtiG0j%2BCyRLGLTF0qrw5Rm88E; loggedIn=true
  }

  res.render("login", {
    pagePath: "/login",
    renderTitle: "Login",
    selectedUser: res.locals.selectedUser,
  });
};

exports.postLoginPage = async (req, res, next) => {
  const {
    "entered-username": enteredUsername,
    "entered-password": enteredPassword,
  } = req.body;

  console.log(enteredUsername, enteredPassword);

  // Sets cookie upon post request to the front end.
  // loggedIn=true
  // It will expire 2023/09/25 00:00AM UTC
  const expiryDate = new Date("2050-09-25T00:00:00Z").toUTCString();
  res.setHeader("Set-Cookie", `loggedIn=true; Expires=${expiryDate}`);

  // Max-Age sets the expiry of the cookie in seconds
  // Even though this cookie will be invalid after 10 seconds
  // It will still stay in browser but will be deleted by browser eventually
  const expirySecond = 10;
  res.setHeader("Set-Cookie", `tenSeconds=true; Max-Age=${expirySecond}`);

  res.redirect("/");
};
```

```text
    Expires:
        This attribute takes a date and time value (in the format specified by RFC 1123) and indicates the exact moment when the cookie will expire. For example: Expires=Wed, 09 Jun 2021 10:18:14 GMT.

    Domain:
        Specifies the domain for which the cookie is valid. The cookie will be sent with requests to subdomains of this domain as well. For example: Domain=example.com.

    Path:
        Specifies the URL path for which the cookie is valid. The cookie will be sent with requests made to this path and its sub-paths. For example: Path=/subpath.

    Secure:
        Indicates that the cookie should only be sent over HTTPS connections. This provides an extra layer of security by ensuring that the cookie is only sent over encrypted connections.

    HttpOnly:
        When set, the cookie cannot be accessed via client-side scripts (e.g., JavaScript). This provides protection against certain types of attacks, like cross-site scripting (XSS).

    SameSite:
        This attribute controls when cookies are sent with requests. It can have three possible values: Strict, Lax, or None. Strict means the cookie will only be sent in a first-party context, Lax means the cookie will be sent with top-level navigations and same-site requests, and None means the cookie will be sent with all requests.

    Priority:
        Indicates the priority of the cookie. This attribute is not widely supported and is typically used in experimental or specific contexts.

    Extension Attributes:
        You can also define custom attributes for cookies. These attributes are ignored by the browser but can be used for application-specific purposes.

Remember, not all browsers support all attributes, and some attributes may have restrictions or behave differently in certain scenarios. Always refer to the relevant specifications and consider the compatibility requirements for your specific use case.
```

## Sessions:

Unlike cookies, sessions are stored in back end.

![how session works PNG](https://github.com/codecygen/103-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose-SessionsandCookies/blob/main/Images/Screenshot%20from%202023-09-24%2015-02-30.png)

To intialize sessions, use these in index.js

```javascript
const session = require("express-session");

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
```

Then in a post based controller function, we need to use

```javascript
req.session.anyName = "yes!";
```

There is also a method that you should keep in mind about sessions. "destroy" method clears out everything in the sessions.

```javascript
req.session.destroy((err) => {
  console.error(err);
  res.redirect("/");
});
```

There is also a method that might be used if you want more control over your res.redirect which is save method for sessions.

```javascript
req.session.save((err) => {
  console.error(err);
  res.redirect("/");
});
```

Next, get based controller function, we can get it back

```javascript
console.log(req.session.anyName);
// Output: yes!
```

After that, for templating engines, res.locals is a feature provided by Express.js. Remember this will not work for libraries like ReactJS.
Firstly, we need to set it in a middleware called populateSelectedUser.js

```javascript
// Express-Session-Keep-Cookie-in-req.session
const populateSelectedUser = (req, res, next) => {

  const selectedUser = {
    userId: req.session.userId,
    userName: req.session.userName,
    userEmail: req.session.userEmail,
    adminId: req.session.adminId,
  };

  res.locals.selectedUser = selectedUser;
  next();
};

module.exports = ;
```

Then we need to initiate it in the shopRoute.js

```javascript
router.use();
```

Finally inside the shopController.js EJS template can access to res.locals values.

```javascript
exports.getAllUsers = async (req, res, next) => {
  const allUsers = await dbAdminOperation.getAllUsers();

  res.render("auth", {
    pagePath: "/auth",
    renderTitle: "Auth",
    userList: allUsers,
    // router.use(); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,
  });
};
```

# Validation and Sanitization

Once you receive the user entered data in post requests, you have both validate and sanitize the data. The validation is making sure the data entered is the data you are expecting. Sanitization is to ensure that the entered data does not have any harmful elements that can potentially compromise your database.

I did not use in this project but, **express-validator** is a popular npm package that is used for data validation and sanitization.

# Error Handling:

There are ways to handle errors gracefully. These can be achieved with **if**, **try-catch** and **then().catch()** blocks.

## Problem with Page Display

Lets say, you want to display all registered users in a page but when your app interacts with server, some problem occurs and your app cannot retrieve the registered users. You have to handle this kind of errors gracefully and display an error page. In order to do this refer to keyword **Error-Page-Middleware**.

```javascript
exports.getUsersPage = async (req, res, next) => {
  try {
    // Uncomment this to crash the /admin.users page.
    // const allUsers = await Table.UserTable.find();

    const allUsers = await Tables.UserTable.find();

    res.render("admin/users", {
      renderTitle: "All Users",
      pagePath: "/admin/users",
      allUsers: allUsers,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    console.error("Error in /admin/users page:", error);
    // Error-Page-Middleware
    // passes error to middleware
    next(error);
  }
};
```

Here, **next(error)** passes error to error handling middleware. In express js, error handling middleware can be used to handle errors. Here is the middleware.

```javascript
// index.js

// Error-Page-Middleware
app.use(errorPageMiddleWare);
```

```javascript
// errorPageMiddleWare.js

// Multer-File-Upload-Download
const multer = require("multer");

// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  // Multer-File-Upload-Download
  // multer if file sie is more than 1MB
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash("add-product-message", "File size is exceeded!");
      return res.redirect("/admin/add-product");
    }
  } else if (err.httpStatusCode) {
    return res.status(err.httpStatusCode).render("[errorPage]", {
      renderTitle: `HTTP Error: ${err.httpStatusCode}`,
      pagePath: null,
      err: err,
    });
  }
};

module.exports = errorPageMiddleware;
```

## 404 Page

To show 404 page, if the page does not exist refer to keyword **404-Page**

## HTTP Status Codes:

There are more codes than these. These codes are used in the rendering cases so it will be shown in the network section of the browser:

```javascript
res.status(500).render(...)
```

![HTTP Status Codes](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-Mongoose-SessionsandCookies-Authentication-Authorization/blob/main/Images/HTTP%20Status%20Codes.png?raw=true)

# Saving Sessions to MongoDB:

The package needed is **connect-mongodb-session**. Codes are given down below on how to make it work. You can also check this in from the npm package.

```javascript
var express = require("express");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

require("dotenv").config();

var app = express();
var store = new MongoDBStore(
  {
    uri: process.env.URL,
    databaseName: "connect_mongodb_session_test",
    collection: "sessions",
  },
  function (error) {
    // Should have gotten an error
  }
);

store.on("error", function (error) {
  // Also get an error here
});

app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);
```

After this, whenever you store any info in req.session, it will automatically be saved into database to "sessions" collection.

# Authentication

![Authentication Photo](https://github.com/codecygen/104-EJS-Templating-Engine-With-MVC-MongoDBwithMongoose-SessionsandCookies-Authentication/blob/main/Images/Screenshot%20from%202023-09-28%2015-18-35.png)

- Check **/Controller/routes/authRoute.js** and **/Controller/controllers/authController.js** for more information on how to authenticate a user.

- **bcrypt** and **expression-session** packages are used for proper authentication processes like signup and login pages.

- **IMPORTANT NOTE**: In this project, I sent form errors with signup and login pages through queries like **await res.redirect(
  `/signup?message=${encodeURIComponent(validityMessage)}`
  );**

  **Express-Flash-Keep-Session-in-req.flash**
  But this can also be done by using an npm package called **connect-flash**. It basically adds a one time use session which will be removed from server's RAM once it is used. **connect-flash** may seem like a more straightforward approach to keep front end notice information to show to the client side user.

```javascript
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

const port = process.env.PORT || 3000;

app.use(
  session({
    secret: "geeksforgeeks",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

app.get("/", (req, res) => {
  req.flash("message", "Success!!");
  res.redirect("/gfg");
});

app.get("/gfg", (req, res) => {
  res.send(req.flash("message"));
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server is up and listening on", port);
});
```

# Authorization

Authorization is all about which person can view which page and can perform which actions.

For authorization, middleware functions are used.

```javascript
// authMiddleware.js

const isLoggedIn = (req, res, next) => {
  if (res.locals.selectedUser.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (res.locals.selectedUser.adminId) {
    next(); // User is an admin, proceed to the next middleware or route handler
  } else {
    res.redirect("/"); // Redirect to a different page or show an error message
  }
};

module.exports = { isLoggedIn, isAdmin };
```

Then in the routes file

```javascript
const { isLoggedIn } = require("../../middleware/authMiddleware");

router.get("/products", isLoggedIn, shopController.getProducts);
```

# CSRF Attacks

**CSRF-Attacks-Prevention** is the keyword to search for it.

A Cross-Site Request Forgery (CSRF) attack is a type of security exploit where an attacker tricks a user's web browser into making an unintended and unauthorized request to a different website on which the user is authenticated. This can lead to actions being taken on the user's behalf without their consent or knowledge. To prevent CSRF attacks, websites use tokens that validate the origin of the request, ensuring it comes from a trusted source.

- 1. Create the CSRF token when user successfully signs in and save it to MongoDB. The keyword is **CSRF-Attacks-Prevention**.

```javascript
exports.postLoginPage = async (req, res, next) => {
  const {
    "entered-username": enteredUsername,
    "entered-password": enteredPassword,
  } = req.body;

  const foundUser = await dbAdminOperation.checkLogin(enteredUsername);

  if (!foundUser) {
    return await res.redirect(
      `/login?message=${encodeURIComponent("no-user")}`
    );
  }

  // Comparing hashed password
  bcrypt.compare(enteredPassword, foundUser.password, async (err, result) => {
    if (err) {
      console.error(err);
      return res.redirect("/login");
    }

    // CSRF-Attacks-Prevention
    const createdToken = uuidv4();

    // set session if user successfully logs in
    if (result === true) {
      req.session.userId = foundUser._id;
      req.session.userName = foundUser.userName;
      req.session.userEmail = foundUser.userEmail;
      req.session.adminId = foundUser.adminId;

      // CSRF-Attacks-Prevention
      req.session.csrfToken = createdToken;

      return res.redirect("/");
    }

    await res.redirect(`/login?message=${encodeURIComponent("wrong-pass")}`);
  });
};
```

- 2. Send CSRF token to the front end with a controller function and also embed the CSRF token to a hidden input in forms. The keyword is **CSRF-Attacks-Prevention**.

```javascript
// Controller function

exports.getCart = async (req, res, next) => {
  const currentUser = await dbAdminOperation.getOneUser(req.session.userId);

  const [cartProductList, cartTotalPrice, userCartDB] =
    await dbCartOperation.getCartProducts(currentUser);

  res.render("cart", {
    pagePath: "/cart",
    renderTitle: "Your Cart",
    cartProducts: cartProductList,
    cartPrice: cartTotalPrice,
    // router.use(populateSelectedUser); // this middleware populates res.locals
    // because it is stored in res.locals, res.render template
    // can reach to selectedUser that is in res.locals
    // selectedUser: res.locals.selectedUser,

    // CSRF-Attacks-Prevention
    csrfToken: req.session.csrfToken,
  });
};
```

Then the cart form should look like this

```HTML
<%- include('includes/head.ejs') %>
    <link rel="stylesheet" href="/shop/productList.css" />
</head>
<body>
    <%- include('includes/nav.ejs') %>
    <main>
        <% if(cartProducts.length > 0) { %>
            <ol>
                <% cartProducts.forEach(cartProduct => { %>
                    <div class="same-line">
                        <li><%= cartProduct.productName %> (<%= cartProduct.productQty %>)</li>
                        <form action="/cart-delete-item" method="POST">
                            <input type="hidden" name="deletedCartItemId" value="<%= cartProduct._id %>" />

                            <!-- CSRF-Attacks-Prevention -->
                            <input type="hidden" name="_csrf" value=<%= csrfToken %>>
                            <button type="submit">Delete Item</button>
                        </form>
                    </div>
                <% }); %>
            </ol>
            <h3>Total Price: <span>$<%= cartPrice %></span></h3>
        <% } else { %>
            <p>There are no products!</p>
        <% } %>

        <form action="/orders" method="POST">
            <!-- CSRF-Attacks-Prevention -->
            <input type="hidden" name="_csrf" value=<%= csrfToken %>>
            <button>Order Now</button>
        </form>
    </main>
</body>
</html>
```

- 3. Finally ask for the CSRF token in form submission controller functions aka post methods. The keyword is **CSRF-Attacks-Prevention**.

```javascript
exports.postCart = async (req, res, next) => {
  // Arguments are (clientCsrfToken, serverCsrfToken)
  const csrfResult = checkCsrfToken(req.body._csrf, req.session.csrfToken);

  // If client and server tokens don't match do nothing.
  if (!csrfResult) {
    res.redirect("/cart");
    return;
  }

  const addedProductId = req.body.addedProductId;

  const addedProduct = await dbProductOperation.getOneProduct(addedProductId);

  const currentUser = await dbAdminOperation.getOneUser(req.session.userId);

  await dbCartOperation.addUserAndProductToCart(currentUser, addedProduct);

  res.redirect("/cart");
};
```

The content of the **checkCsrfToken** function is;

```javascript
const checkCsrfToken = (clientCsrfToken, serverCsrfToken) => {
  if (clientCsrfToken !== serverCsrfToken) {
    console.error("Invalid CSRF Token!");
    return false;
  }

  return true;
};

module.exports = checkCsrfToken;
```

- 4. Finally the CSRF attack website content could be like this;

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p>Say hello to my little friend!</p>

    <!-- Malicious Website (Attacker's Website) -->
    <form action="http://localhost:3000/cart" method="POST" id="maliciousForm">
        <!-- Product id -->
        <input type="hidden" name="addedProductId" value="651f0df22a73acb70d0f836b" />

        <!-- csrf token guessing for csrf website -->
        <input type="hidden" name="_csrf" value="secretCSRF-guessed-value" />
        <button type="submit">Add to Cart - Malicious</button>
    </form>
</body>
</html>
```

If you accidentally click the link on the malicious website, since that form's csrf value is not going to match the csrf value that is coming from the server, server will not handle the request and add the item to the cart.

- 5. Keep in mind that CSRF token is only important for post methods that are going to change something critical with the user like sending money, changing address etc. Login and Signup pages won't need a CSRF token.

# File Upload and Download

**Multer-File-Upload-Download** is the keyword for this section.

- 1. Install the npm package **multer**.

- 2. Add **enctype="multipart/form-data"** to the form where you also want to submit a file.

```javascript
<form
  action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>"
  method="POST"
  class="centered"
  enctype="multipart/form-data"
>
  ...
</form>
```

- 3. Configure **multer** package in routing file **adminRoute.js** as a middleware.

```javascript
.....

// Multer-File-Upload-Download
const multer = require("multer");

// Multer-File-Upload-Download
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

// Multer-File-Upload-Download
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype;

  const fileExtension = path.extname(file.originalname).split(".").pop();

  if (
    fileType === "image/png" ||
    fileType === "image/jpg" ||
    fileType === "image/jpeg"
  ) {
    // To accept file, pass true, or false if you don't want!
    cb(null, true);
  } else {
    req.notAllowedFileExtension = fileExtension;
    return cb(null, false, req.notAllowedFileExtension);
  }
};

// Multer-File-Upload-Download
// file upload location is "/uploads"
const upload = multer({
  storage: fileStorage,
  // 1MB file size limit
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
});

.....

router.post(
  "/add-product",
  // Multer-File-Upload-Download
  upload.single("newProductImage"),
  isAdmin,
  adminController.postAddProduct
);
```

- 4. Then, in the controller file which is **adminController.postAddProduct** for this case, the submitted file will be available in **req.file**.

```javascript
exports.postAddProduct = async (req, res, next) => {
 ...

  const newProduct = {
    productName: req.body.newProductName,
    productDesc: req.body.newProductDescription,
    productPrice: req.body.newProductPrice,
    // Multer-File-Upload-Download
    productImg: req.file && req.file.path ? req.file.path : null,
    adminId: res.locals.selectedUser.adminId,
  };

  ...
  if
  ...
  else if (req.notAllowedFileExtension) {
    // Multer-File-Upload-Download
    req.flash(
      "add-product-message",
      `${req.notAllowedFileExtension} is not allowed. Only jpeg, jpg and png are allowed.`
    );
    return res.redirect("/admin/add-product");
  } else if (!newProduct.productImg) {
    // Multer-File-Upload-Download
    req.flash("add-product-message", "Please upload an image file!");
    return res.redirect("/admin/add-product");
  } 
}
```

the console.log for newProduct.productImg will give something like this

```javascript
{
  fieldname: 'newProductImage',
  originalname: '07_Dragon.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads',
  filename: '1699898124801-448980481-07_Dragon.jpg',
  path: 'uploads/1699898124801-448980481-07_Dragon.jpg',
  size: 857444
}
```

- 5. We should also have an error page to handle errors related to the case where file size gets exceeded.

```javascript
// Multer-File-Upload-Download
const multer = require("multer");

// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  // Multer-File-Upload-Download
  // multer if file sie is more than 1MB
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash("add-product-message", "File size is exceeded!");
      return res.redirect("/admin/add-product");
    }
  } else if (err.httpStatusCode) {
    return res.status(err.httpStatusCode).render("[errorPage]", {
      renderTitle: `HTTP Error: ${err.httpStatusCode}`,
      pagePath: null,
      err: err,
    });
  }
};

module.exports = errorPageMiddleware;
```

- 6. Finally, when the image file gets uploaded, it has to be shown properly in img tags. Since the console.log for newProduct.productImg will give something like this

```javascript
{
  fieldname: 'newProductImage',
  originalname: '07_Dragon.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads',
  filename: '1699898124801-448980481-07_Dragon.jpg',
  path: 'uploads/1699898124801-448980481-07_Dragon.jpg',
  size: 857444
}
```

path of the uploaded image will reside in database and in system as shown **path: 'uploads/1699898124801-448980481-07_Dragon.jpg'**. So in index file,

```javascript
// Multer-File-Upload-Download
// This is for serving uploaded images folder to show products.
// imagine this file:
// uploads/1700158739221-40615879-01_World.jpg
// if it was
// app.use(express.static(path.join(__dirname, "uploads")));
// app will think the file will be ready in
// localhost:3000/1700158739221-40615879-01_World.jpg
// But when you say 
//  <img 
  // src="/<%= product.productImg %>" 
  // alt=<%= product.productName %>  
  // height="300"
//  >
// src will look into localhost:3000/uploads/1700158739221-40615879-01_World.jpg
// and this path does not exist
// by doing it as the way down on the bottom, we tell express to
// go to localhost/uploads, then treat the uploads directory as the
// base/root directory, then apply uploads directory as the static root directory
// so localhost:3000/uploads/1700158739221-40615879-01_World.jpg will be the actual path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

a static path is needed where application has to find uploads and then treats uploads file as the root directory. Then in ejs file, it should show this location.

```html
<!-- Multer-File-Upload-Download -->
<img 
  src="/<%= product.productImg %>" 
  alt=<%= product.productName %> 
  height="300"
>

```

- 7. If you want your clients to download a pdf invoice file whenever they need, refer to the keyword **multer-pdf-file-download**.