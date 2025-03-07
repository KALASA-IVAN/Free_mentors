# 🏆 Free Mentors

Free Mentors is a mentorship platform where professionals provide free guidance to mentees looking for career growth and skill development.

## 🚀 Project Overview

This project consists of two main parts:

- **Backend:** Built with Django, GraphQL, and MongoDB (MongoEngine)
- **Frontend:** Developed using React.js with Material UI

---

## 📌 Features

### **🌐 Backend Features (Django + GraphQL + MongoDB)**

✅ User Authentication (Signup/Login with JWT)\
✅ Role-based Access (Users, Mentors, Admins)\
✅ Request Mentorship Sessions\
✅ Accept/Reject Session Requests\
✅ View All Mentorship Sessions (Users & Mentors)\
✅ Leave Reviews for Mentors\
✅ Admin Moderation (Hide Inappropriate Reviews)\
✅ API Documentation with GraphQL Playground & Swagger

### **🎨 Frontend Features (React + Material UI)**

✅ User Signup/Login UI\
✅ Dashboard for Mentees & Mentors\
✅ Booking Mentorship Sessions\
✅ Viewing Session History\
✅ Leaving & Viewing Reviews\
✅ Admin Panel for User Management

---

## 📂 Project Structure

```
Free_Mentors/
│── Backend/              # Django Backend
│   ├── mentorship/       # Mentorship app
│   ├── free_mentors/     # Core settings
│   ├── requirements.txt  # Dependencies
│   ├── docker-compose.yml # Docker setup
│   ├── README.md         # Backend instructions
│
│── Frontend/             # React Frontend
│   ├── src/              # Source files
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies
│   ├── README.md         # Frontend instructions
```

---

## 🛠️ Setup & Installation

### **📌 Prerequisites**

Ensure you have the following installed:

- **Docker & Docker Compose** ([Install Guide](https://docs.docker.com/get-docker/))
- **Node.js & npm** (for frontend) ([Download](https://nodejs.org/))

### **🐳 Running the Backend with Docker**

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Free_Mentors.git
cd Free_Mentors/Backend
docker-compose up --build
```

✅ **Backend is now running at:** [`http://127.0.0.1:8000/graphql/`](http://127.0.0.1:8000/graphql/)

### **🖥️ Running the Frontend**

```bash
cd ../Frontend
npm install
npm start
```

✅ **Frontend is now running at:** [`http://localhost:3000/`](http://localhost:3000/)

---

## 🔍 API Documentation

### **GraphQL Playground** (Backend API Testing)

📍 [`http://127.0.0.1:8000/graphql/`](http://127.0.0.1:8000/graphql/)

### **Swagger UI** (For REST endpoints if needed)

📍 [`http://127.0.0.1:8000/api/docs/`](http://127.0.0.1:8000/api/docs/)

---

## 📌 Common Commands

### **🐳 Docker Commands**

```bash
docker-compose up --build  # Start containers
docker-compose down        # Stop containers
docker-compose logs -f     # View logs
```

### **📦 Backend Development Commands**

```bash
python manage.py runserver # Start Django locally
python manage.py migrate   # Apply database migrations
python manage.py createsuperuser # Create an admin user
```

### **💻 Frontend Development Commands**

```bash
npm install  # Install dependencies
npm start    # Start the frontend
```

---

## 🤖 Authentication (JWT)

- **Login Request:**

```graphql
mutation {
  loginUser(email: "user@example.com", password: "password") {
    accessToken
    user {
      firstName
      email
      isAdmin
    }
  }
}
```

- **Use JWT Token in Headers**

```json
{
  "session": "your_access_token_here"
}
```

---

## 🎯 Troubleshooting

### **1️⃣ Port Already in Use?**

```bash
docker stop $(docker ps -q)
docker-compose up --build
```

### **2️⃣ Database Connection Issues?**

Ensure MongoDB is running inside Docker:

```bash
docker-compose ps
```

### **3️⃣ Permission Issues?**

If you face permission errors, try running Docker commands with `sudo`:

```bash
sudo docker-compose up --build
```

---

## 🤝 Contributors

- Ivan** (Backend Developer)**
- **Beula **(Frontend Developer)

🙌 Want to contribute? Fork the repo and submit a pull request!

---

##
