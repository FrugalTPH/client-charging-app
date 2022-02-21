define({ "api": [
  {
    "type": "post",
    "url": "http://cde.fyi/signup",
    "title": "Signup",
    "name": "createUser",
    "group": "Guest",
    "description": "<p>Creates new user and redirects to user confirmation route</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://cde.fyi/signup HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\",\n  \"password\": \"password\"\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The new account email address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Check your email and click on the verification link sent\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/www.js",
    "groupTitle": "Guest"
  },
  {
    "type": "post",
    "url": "http://cde.fyi/forgotPassword",
    "title": "Forgot password",
    "name": "forgotPassword",
    "group": "Guest",
    "description": "<p>Resets user password with an auto-generated one, and emails it out to the user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://cde.fyi/forgotPassword HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\",\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The account email address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Check your email for a new password that can be used to log into your account\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/www.js",
    "groupTitle": "Guest"
  },
  {
    "type": "post",
    "url": "http://cde.fyi/login",
    "title": "Login",
    "name": "userLogin",
    "group": "Guest",
    "description": "<p>Logs the user in so that they become an User</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://cde.fyi/login HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\",\n  \"password\": \"password\",\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The account email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cookie",
            "description": "<p>A JWT uniquely identifying the User login to store in a response cookie</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"You have been logged in on this device\",\n  \"data\": \"joe@bloggs.com\",\n  \"cookie\": \"1234567890\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/www.js",
    "groupTitle": "Guest"
  },
  {
    "type": "post",
    "url": "http://admin.cde.fyi/p",
    "title": "Create a plan",
    "name": "createPlan",
    "group": "Logged_In_Admin",
    "description": "<p>Creates a new subscription (product) plan</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://admin.cde.fyi/c HTTP/1.1\n{ \n  \"_id\": \"2019-starter\",\n  \"clientRate\": 1.37,\n  \"modelRate\": 1.64,\n  \"vatRate\": 0.2,\n  \"currency\": \"£\"\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The new product plan name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Client account created\",\n  \"data\": \"2019-starter\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "post",
    "url": "http://admin.cde.fyi/c/hold/:client",
    "title": "Hold client",
    "name": "holdClient",
    "group": "Logged_In_Admin",
    "description": "<p>Holds service provision for the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://admin.cde.fyi/c/hold/acme-ltd HTTP/1.1",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The client id affected</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Client is on hold\",\n  \"data\": \"frugal-design\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "post",
    "url": "http://admin.cde.fyi/u/hold/:user",
    "title": "Hold user",
    "name": "holdUser",
    "group": "Logged_In_Admin",
    "description": "<p>Holds service provision for the given user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://admin.cde.fyi/u/hold/23TplPdS HTTP/1.1",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The user affected</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"User is on hold\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "get",
    "url": "http://admin.cde.fyi/c",
    "title": "List clients",
    "name": "listClients",
    "group": "Logged_In_Admin",
    "description": "<p>Lists all clients</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://admin.cde.fyi/c HTTP/1.1",
        "type": "get"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all client profiles with ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profiles retrieved\",\n  \"data\": [\n     { \"name\": \"acme-ltd\", \"website\": \"http://acme-ltd.co.uk\", \"_id\": \"eWRhpRV\" }, \n     { \"name\": \"frugal-design\", \"website\": \"http://frugaldesign.co.uk\", \"_id\": \"23TplPdS\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "get",
    "url": "http://admin.cde.fyi/i",
    "title": "List invoices",
    "name": "listInvoices",
    "group": "Logged_In_Admin",
    "description": "<p>Lists all invoices</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://admin.cde.fyi/i HTTP/1.1",
        "type": "get"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all invoice profiles with ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profiles retrieved\",\n  \"data\": [\n     { \"date\": \"2019-10-30\", \"amount\": \"£250.00\", \"_id\": \"dogPzIz8\" }, \n     { \"date\": \"2019-09-30\", \"amount\": \"£250.00\", \"_id\": \"nYrnfYEv\" }, \n     { \"date\": \"2019-08-30\", \"amount\": \"£250.00\", \"_id\": \"a4vhAoFG\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "get",
    "url": "http://admin.cde.fyi/m",
    "title": "List models",
    "name": "listModels",
    "group": "Logged_In_Admin",
    "description": "<p>Lists all models</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://admin.cde.fyi/m HTTP/1.1",
        "type": "get"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all model profiles with ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profiles retrieved\",\n  \"data\": [\n     { \"displayName\": \"Site 1 Asset Information Model\", \"_id\": \"dBvJIh-H\" }, \n     { \"displayName\": \"Site 2 Asset Information Model\", \"_id\": \"2WEKaVNO\" },\n     { \"displayName\": \"Site 3 Asset Information Model\", \"_id\": \"7oet_d9Z\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "get",
    "url": "http://admin.cde.fyi/u",
    "title": "List users",
    "name": "listUsers",
    "group": "Logged_In_Admin",
    "description": "<p>Lists all users by displayName</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://admin.cde.fyi/u HTTP/1.1\n{ \"profile.displayName\": { \"$regex\": \"Hart\", \"$options\": \"i\" } }",
        "type": "get"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all the user names with ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profiles retrieved\",\n  \"data\": [\n     { \"displayName\": \"Joe Bloggs\", \"_id\": \"eWRhpRV\" }, \n     { \"displayName\": \"Darth Vadar\", \"_id\": \"23TplPdS\" }, \n     { \"displayName\": \"Luke Skywalker\", \"_id\": \"46Juzcyx\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "post",
    "url": "http://admin.cde.fyi/c/unhold/:client",
    "title": "Unhold client",
    "name": "unholdClient",
    "group": "Logged_In_Admin",
    "description": "<p>Unholds service provision for the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://admin.cde.fyi/c/unhold/acme-ltd HTTP/1.1",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The client id affected</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Client is off hold\",\n  \"data\": \"frugal-design\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "post",
    "url": "http://admin.cde.fyi/u/unhold/:client",
    "title": "Unhold user",
    "name": "unholdUser",
    "group": "Logged_In_Admin",
    "description": "<p>Unholds service provision for the given user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://admin.cde.fyi/u/unhold/23TplPdS HTTP/1.1",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The user affected</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"User is off hold\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Logged_In_Admin"
  },
  {
    "type": "post",
    "url": "http://users.cde.fyi/me/email",
    "title": "Add an email",
    "name": "addEmail",
    "group": "Logged_In_User",
    "description": "<p>Adds a secondary user email address and initiates the verification process</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://users.cde.fyi/me/email HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\"\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The newly added email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Check your email and click on the verification link sent\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "post",
    "url": "http://users.cde.fyi/c",
    "title": "Create a client",
    "name": "clientCreate",
    "group": "Logged_In_User",
    "description": "<p>Creates a new client and initiates the new client onboarding process</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://users.cde.fyi/c HTTP/1.1\n{ \n  \"name\": \"frugal-design\",\n  \"plan\": \"pro\",\n  \"address\": {\n  \t\"companyName\": \"Frugal Consultancy + Design Ltd.\",\n  \t\"companyNumber\": \"12345678\",\n  \t\"vatNumber\": \"GB1234567\",\n  \t\"address\": \"63 Hymers Avenue\",\n  \t\"postCode\": \"HU3 1LL\",\n  \t\"faoName\": \"Tom Hartley\",\n  \t\"faoPhone\": \"07852 206 088\",\n  \t\"faoEmail\": \"tom@frugaldesign.co.uk\"\n  }\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The new account name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Prospective client account created\",\n  \"data\": { \"name\": \"acme-ltd\", \"manager\": \"WI9vWJ4k\" }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "post",
    "url": "http://users.cde.fyi/me/logout",
    "title": "Logout here",
    "name": "logout",
    "group": "Logged_In_User",
    "description": "<p>Logs the User off their current device</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://users.cde.fyi/me/logout HTTP/1.1",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The account email address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"You have been logged out on this device\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "post",
    "url": "http://users.cde.fyi/me/logoutall",
    "title": "Logout everywhere",
    "name": "logoutAll",
    "group": "Logged_In_User",
    "description": "<p>Logs the User off of all their devices</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://users.cde.fyi/me/logoutall HTTP/1.1",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The account email address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"You have been logged out of all your devices\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "get",
    "url": "http://users.cde.fyi/:user",
    "title": "Read a profile",
    "name": "readGivenProfile",
    "group": "Logged_In_User",
    "description": "<p>Returns a given user's profile</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://users.cde.fyi/eWRhpRV HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Users account ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The returned profile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profile retrieved\",\n  \"data\": \n     { \n         \"displayName\": \"Joe Bloggs\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "get",
    "url": "http://users.cde.fyi/me",
    "title": "Read my profile",
    "name": "readProfile",
    "group": "Logged_In_User",
    "description": "<p>Returns the User's profile</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://users.cde.fyi/me HTTP/1.1",
        "type": "get"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The returned profile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profile retrieved\",\n  \"data\": \n     { \n         \"displayName\": \"Joe Bloggs\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "delete",
    "url": "http://users.cde.fyi/me/email",
    "title": "Remove an email",
    "name": "removeEmail",
    "group": "Logged_In_User",
    "description": "<p>Removes (deletes) a secondary user email address</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "DELETE http://users.cde.fyi/me/email HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\"\n}",
        "type": "delete"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The email that was deleted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"The specified email has been removed from our records\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "patch",
    "url": "http://users.cde.fyi/me/email",
    "title": "Switch email",
    "name": "switchEmail",
    "group": "Logged_In_User",
    "description": "<p>Switches the User's main email with a specified &amp; verified secondary email</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "PATCH http://users.cde.fyi/me/email HTTP/1.1\n{ \n  \"email\": \"joseph@bloggs.com\"\n}",
        "type": "patch"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Details of the old and new emails</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Main account email has been switched to...\",\n  \"data\": \"joseph@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "patch",
    "url": "http://users.cde.fyi/me/password",
    "title": "Update password",
    "name": "updatePassword",
    "group": "Logged_In_User",
    "description": "<p>Updates the User's account password and logs out all their devices</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "PATCH http://users.cde.fyi/me/password HTTP/1.1\n{ \n  \"password\": \"password\",\n  \"newPassword\": \"pa55w0rd\"\n}",
        "type": "patch"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The account email address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Password updated\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "patch",
    "url": "http://users.cde.fyi/me",
    "title": "Update profile",
    "name": "updateProfile",
    "group": "Logged_In_User",
    "description": "<p>Updates the User's profile</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "PATCH http://users.cde.fyi/me HTTP/1.1\n{ \n  \"name\": \"Joe 'Danger' Bloggs\"\n}",
        "type": "patch"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The account email address</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Profile updated\",\n  \"data\": \"joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.js",
    "groupTitle": "Logged_In_User"
  },
  {
    "type": "post",
    "url": "http://acme-ltd.cde.fyi/manager/:user",
    "title": "Add Manager",
    "name": "addManager",
    "group": "Verified_Client",
    "description": "<p>Grants manager-level permissions for this client's data to the given user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://acme-ltd.cde.fyi/manager/dogPzIz8 HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\"\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The main email of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Manager-level client permissions granted\",\n  \"data\": \"acme-ltd : joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "post",
    "url": "http://acme-ltd.cde.fyi/user/:user",
    "title": "Add User",
    "name": "addUser",
    "group": "Verified_Client",
    "description": "<p>Grants user-level permissions for this client's data to the given user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://acme-ltd.cde.fyi/user/dogPzIz8 HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\"\n}",
        "type": "post"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The main email of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"User-level client permissions granted\",\n  \"data\": \"acme-ltd : joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "post",
    "url": "http://:client.cde.fyi/m",
    "title": "Create a model",
    "name": "createModel",
    "group": "Verified_Client",
    "description": "<p>Creates a new Model for the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "POST http://acme-ltd.cde.fyi/m HTTP/1.1\n{ \n   \"displayName\": \"Site x Project Information Model\", \n}",
        "type": "post"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The id of the model that was created</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Model created\",\n  \"data\": \"2WEKaVNO\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "delete",
    "url": "http://:client.cde.fyi/m/:model",
    "title": "Delete a model",
    "name": "deleteModel",
    "group": "Verified_Client",
    "description": "<p>Deletes (archives) the given model for the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "DELETE http://acme-ltd.cde.fyi/m/2WEKaVNO HTTP/1.1",
        "type": "delete"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>Model ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The model id of the model that was deleted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Model updated\",\n  \"data\": \"2WEKaVNO\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "get",
    "url": "http://:client.cde.fyi/i",
    "title": "List invoices",
    "name": "listInvoices",
    "group": "Verified_Client",
    "description": "<p>Lists all invoices associated with the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://acme-ltd.cde.fyi/i HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all the invoice summaries (date, amount &amp; ids)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Invoice summaries retrieved\",\n  \"data\": [\n     { \"date\": \"2019-10-30\", \"amount\": \"£250.00\", \"_id\": \"dogPzIz8\" }, \n     { \"date\": \"2019-09-30\", \"amount\": \"£250.00\", \"_id\": \"nYrnfYEv\" }, \n     { \"date\": \"2019-08-30\", \"amount\": \"£250.00\", \"_id\": \"a4vhAoFG\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "get",
    "url": "http://:client.cde.fyi/m",
    "title": "List models",
    "name": "listModels",
    "group": "Verified_Client",
    "description": "<p>Lists models associated with the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://acme-ltd.cde.fyi/m HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all the models' names and ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Model summaries retrieved\",\n  \"data\": [\n     { \"displayName\": \"Site 1 Asset Information Model\", \"_id\": \"dBvJIh-H\" }, \n     { \"displayName\": \"Site 2 Asset Information Model\", \"_id\": \"2WEKaVNO\" }, \n     { \"displayName\": \"Site 3 Asset Information Model\", \"_id\": \"7oet_d9Z\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "get",
    "url": "http://:client.cde.fyi/t",
    "title": "List transactions",
    "name": "listTransactions",
    "group": "Verified_Client",
    "description": "<p>Lists transactions associated with the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://acme-ltd.cde.fyi/t HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all the models' names and ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Transaction summaries retrieved\",\n  \"data\": [\n     { \"displayName\": \"Site 1 Asset Information Model\", \"_id\": \"dBvJIh-H\" }, \n     { \"displayName\": \"Site 2 Asset Information Model\", \"_id\": \"2WEKaVNO\" }, \n     { \"displayName\": \"Site 3 Asset Information Model\", \"_id\": \"7oet_d9Z\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "get",
    "url": "http://:client.cde.fyi/u",
    "title": "List users",
    "name": "listUsers",
    "group": "Verified_Client",
    "description": "<p>Lists users associated with the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://acme-ltd.cde.fyi/u HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all the user names with ids</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"User profiles retrieved\",\n  \"data\": [\n     { \"displayName\": \"Joe Bloggs\", \"_id\": \"eWRhpRV\" }, \n     { \"displayName\": \"Darth Vadar\", \"_id\": \"23TplPdS\" }, \n     { \"displayName\": \"Luke Skywalker\", \"_id\": \"46Juzcyx\" }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "get",
    "url": "http://:client.cde.fyi/i/:invoice",
    "title": "Read an invoice",
    "name": "readInvoice",
    "group": "Verified_Client",
    "description": "<p>Returns the given client invoice</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://acme-ltd.cde.fyi/i/dogPzIz8 HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "invoice",
            "description": "<p>Invoice ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The returned invoice summary</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Invoice retrieved\",\n  \"data\":\n   { \n      \"date\": \"2019-10-30\", \n      \"amount\": \"£250.00\",\n      \"_id\": \"dogPzIz8\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "get",
    "url": "http://:client.cde.fyi/m/:model",
    "title": "Read a model",
    "name": "readModel",
    "group": "Verified_Client",
    "description": "<p>Returns the given model for the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "GET http://acme-ltd.cde.fyi/m/2WEKaVNO HTTP/1.1",
        "type": "get"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>Model ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The returned model summary</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Model retrieved\",\n  \"data\":\n   { \n      \"displayName\": \"Site 1 Asset Information Model\", \n      \"archivedDate\": \"2019-04-01\", \n      \"_id\": \"dBvJIh-H\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "delete",
    "url": "http://acme-ltd.cde.fyi/manager/:user",
    "title": "Remove Manager",
    "name": "removeManager",
    "group": "Verified_Client",
    "description": "<p>Revokes manager-level permissions for this client's data from the given user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "DELETE http://acme-ltd.cde.fyi/manager/dogPzIz8 HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\"\n}",
        "type": "delete"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The main email of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Manager-level client permissions revoked\",\n  \"data\": \"acme-ltd : joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "delete",
    "url": "http://acme-ltd.cde.fyi/user/:user",
    "title": "Remove User",
    "name": "removeUser",
    "group": "Verified_Client",
    "description": "<p>Revokes user-level permissions for this client's data from the given user</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "DELETE http://acme-ltd.cde.fyi/user/dogPzIz8 HTTP/1.1\n{ \n  \"email\": \"joe@bloggs.com\"\n}",
        "type": "delete"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message and next steps</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The main email of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"User-level client permissions revoked\",\n  \"data\": \"acme-ltd : joe@bloggs.com\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  },
  {
    "type": "patch",
    "url": "http://:client.cde.fyi/m/:model",
    "title": "Update a model",
    "name": "updateModel",
    "group": "Verified_Client",
    "description": "<p>Updates the given model for the given client</p>",
    "examples": [
      {
        "title": "Example:",
        "content": "PATCH http://acme-ltd.cde.fyi/m/2WEKaVNO HTTP/1.1\n{ \n  \"displayName\": \"Site 1 AIM\"\n}",
        "type": "patch"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "client",
            "description": "<p>Client account name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>Model ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>An action summary message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>The model id of the model that was updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"Model updated\",\n  \"data\": \"2WEKaVNO\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/client.js",
    "groupTitle": "Verified_Client"
  }
] });
