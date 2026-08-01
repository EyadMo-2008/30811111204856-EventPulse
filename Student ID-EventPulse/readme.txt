# 30811111204856-EventPulse

EventPulse is a production-ready, secure, and real-time Event Management Backend API built with Node.js, Express, MongoDB, and Socket.io.
---

## 🛠 Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database & ORM:** MongoDB, Mongoose
- **Real-Time Communication:** Socket.io
- **Security & Auth:** bcryptjs, jsonwebtoken (JWT)
- **Validation & Error Handling:** express-validator, Centralized AppError & asyncHandler
- **Testing:** Jest, Supertest

---

## 📁 Project Structure

```text
30811111204856-EventPulse/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── eventController.js
├── middleware/
│   ├── auth.js
│   ├── errorMiddleware.js
│   └── validate.js
├── models/
│   ├── Category.js
│   ├── Event.js
│   ├── Message.js
│   ├── Registration.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── eventRoutes.js
├── utils/
│   ├── AppError.js
│   ├── asyncHandler.js
│   └── seed.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
🚀 Local Setup & Installation
1. Clone the repository
Bash
git clone [https://github.com/EyadMo-2008/30811111204856-EventPulse.git](https://github.com/EyadMo-2008/30811111204856-EventPulse.git)
cd 30811111204856-EventPulse
2. Install dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory based on .env.example:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
4. Seed the Database
Bash
npm run seed
5. Start the Server
Bash
npm run dev
🧪 Testing Evidence
All unit and integration tests pass successfully.

To run the tests:

Bash
npm test
 github link respository : https://github.com/EyadMo-2008/30811111204856-EventPulse
