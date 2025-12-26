
# Scholarship Application and Management Portal

## Project Overview
This is a comprehensive web-based portal designed to streamline the scholarship application process. It serves two main user groups: **Students**, who can search and apply for scholarships, and **Admins**, who manage schemes and review applications. The system ensures a seamless, paperless workflow with real-time status updates and secure document handling.

---

## Features

### 🎓 Student Portal
- **Secure Authentication**: User registration and login with JWT-based sessions.
- **Profile Management**: Complete profile setup including personal, educational, and family details.
- **Scholarship Browsing**: View available scholarship schemes with eligibility criteria.
- **Application System**: Step-by-step application form with document upload support.
- **Status Tracking**: Real-time updates on application status (Submitted, Under Review, Approved, Rejected).
- **Notifications**: Email and SMS alerts for important updates.

### 🛡️ Admin Portal
- **Dashboard**: High-level overview of total applications, pending reviews, and approval stats.
- **Scheme Management**: Create, update, and remove scholarship schemes.
- **Application Review**: Detailed view of student applications and uploaded documents.
- **Workflow Management**: Approve or reject applications with mandatory remarks.
- **User Management**: Oversee student and admin accounts.

---

## 💻 Technology Stack

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB (via Mongoose ODM)
- **Caching**: Redis (via ioredis)
- **Authentication**: JWT & Bcrypt
- **Validation**: Joi
- **File Handling**: Multer (Local/Cloud storage)
- **Communication**: Nodemailer (Email), Twilio (SMS)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend (User Interface)
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: TailwindCSS v4
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

---



## 🚀 Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Redis server (optional, checks configuration)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/scholarship-management.git
cd scholarship-management
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd scholarship-backend
npm install
```

Create a `.env` file in `scholarship-backend/` based on the example below:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/scholarship_db
# or your MongoDB Atlas URI

JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Feature Flags
EMAIL_DISABLED=false
SMS_DISABLED=true

# File Uploads
UPLOAD_DIR=uploads
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd scholarship-frontend
npm install
```

Create a `.env.local` file in `scholarship-frontend/` (if needed for API URL):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing
The backend includes a test suite using Jest and Supertest.
```bash
cd scholarship-backend
npm test
```

---

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
Created by **Nitin Singh** - [nitinsingh14210@gmail.com]


📌 Introduction

The Scholarship Application and Management Portal is a full-stack MERN-based web application designed to simplify and digitize the scholarship application process.

Scholarship applications often involve complex procedures, lack of transparency, and delayed communication between students and administrators. This portal solves these issues by providing a centralized, role-based system where students can easily apply for scholarships and administrators can efficiently manage applications.

The system includes separate portals for Students and Admins, ensuring secure access, structured workflows, and an improved user experience.

🎯 Problem Statement

Scholarship applications often involve complex processes and lack transparency.
A portal is required to manage applications, track eligibility, and ensure timely communication with applicants.

🛠 Tech Stack (MERN)
Frontend

React.js / Next.js

TypeScript

Redux Toolkit

Tailwind CSS

Dark & Light Mode UI

Captcha Integration

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Tools & Utilities

Docker & Docker Compose

Jest (Testing)

ESLint

Git & GitHub

👥 User Roles & Features
🎓 Student Portal

Student Signup & Login

Apply for available Scholarships

View application status (Pending / Accepted / Rejected)

Captcha verification for enhanced security

Forgot Password & Reset Password

Profile management

Responsive UI with Dark & Light Mode

Secure authentication using JWT

🛡 Admin Portal

Admin Signup & Login

Create and manage Scholarship Programs

View all student applications

Accept / Reject applications

Dashboard for application management

Secure role-based authorization

✨ Key Features

🔐 Role-based authentication (Student & Admin)

📄 Scholarship application management

🌗 Dark / Light mode support

🤖 Captcha integration

🔁 Forgot password functionality

📊 Clean and modern UI

⚡ Scalable MERN architecture

📂 Project Structure
Backend (scholarship-backend)
scholarship-backend/
│── src/
│   ├── config/
│   ├── controllers/
│   ├── emails/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   ├── server.js
│── uploads/
│── .env
│── .env.example
│── package.json
│── docker-compose.yml

Frontend (scholarship-frontend)
scholarship-frontend/
│── src/
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   ├── store/
│   ├── app/
│── public/
│── .env.local
│── package.json
│── next.config.ts
│── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/scholarship-application-portal.git
cd scholarship-application-portal

2️⃣ Backend Setup
cd scholarship-backend
npm install
npm run dev


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

3️⃣ Frontend Setup
cd scholarship-frontend
npm install
npm run dev

📸 Screenshots

Add screenshots in a screenshots/ folder and reference them like this:

## 📸 Screenshots

### Student Login
![Student Login](screenshots/StudentLogin.png)

### Student Signup
![Student Signup](screenshots/StudentSignUp.png)

### Student Dashboard
![Dashboard](screenshots/Dashboard.png)

### Dashboard Overview
![Dashboard Overview](screenshots/Dashboardovervuew.png)

### Apply for Scholarship
![Apply](screenshots/Apply.png)

### Scholarship List
![Scholarship](screenshots/Scholarship.png)

### Application Status
![Status](screenshots/Status.png)

### Profile Page
![Profile](screenshots/Profile.png)

### Admin – Manage Scholarships
![Manage Scholarship](screenshots/ManageScholarship.png)

### Admin – Accept / Reject Applications
![Accept Reject](screenshots/AcceptReject.png)

### Admin – Approve / Decline
![Approve Decline](screenshots/ApproveDecline.png)


🧪 Testing
npm test

🚧 Challenges Faced

Implementing secure role-based authentication

Managing two separate user portals (Student & Admin)

Redux state management

Designing responsive UI with Dark & Light themes

Integrating captcha and form validations

🏁 Conclusion

The Scholarship Application and Management Portal provides a transparent, efficient, and user-friendly solution for managing scholarship applications. It simplifies the process for students while giving administrators complete control over application review and decision-making.

This project demonstrates practical knowledge of MERN stack development, authentication, authorization, and modern UI/UX design.

