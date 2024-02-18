# User Management App
This is a simple user management application built with Node.js, Express, and MongoDB. It allows administrators to register and manage users, including changing their bosses and viewing user lists based on their roles.

## Features
- User Registration: Administrators can register new users with username, password, and role.
- User Authentication: Users can log in using their username and password.
- Role-based Access Control: Different roles have different access rights:
  * Administrator: Can register users and view the list of all users.
  * Boss: Can view the list of their subordinates and change their bosses.
  * Regular User: Can only view their own profile.
- Secure Authentication: Passwords are hashed using bcrypt before storing them in the database.
- JWT Token-based Authentication: JWT tokens are used for user authentication and authorization.
## Installation
Clone the repository:
```
git clone https://github.com/SkVaDaR/test1
```

Install dependencies:
```
npm install
```

Set up environment variables:
Create a .env file in the root directory and provide the following variables:
```
PORT=your_port_number
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Start the server:
```
npx ts-node app.ts
```
### API Endpoints
- POST /register: Register a new user (accessible to administrators).
- POST /login: Authenticate a user and get a JWT token.
- GET /users: Get the list of users (accessible based on user roles).
- PUT /users/:userId/change-boss: Change a user's boss (accessible to bosses).

### Technologies Used
* Node.js
* Express
* MongoDB
* Mongoose
* bcrypt
* JSON Web Tokens (JWT)
