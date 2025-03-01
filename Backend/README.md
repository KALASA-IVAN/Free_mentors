# Free Mentors - Docker Setup Guide

## 📌 Prerequisites

Before running the project, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## 📥 Cloning the Repository

To get started, clone the repository:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Free_Mentors.git
cd Free_Mentors/Backend
```

---

## 🐳 Running the Project with Docker

### **1️⃣ Build and Start the Containers**

Run the following command to build and start the project:

```bash
docker-compose up --build
```

This will:

- Build the **Django backend** and install dependencies.
- Start a **MongoDB container**.
- Apply database migrations automatically.

### **2️⃣ Accessing the Application**

Once running, access the application at:

- **GraphQL API:** [`http://127.0.0.1:8000/graphql/`](http://127.0.0.1:8000/graphql/)


---

## 📌 Common Docker Commands

### **Check Running Containers:**

```bash
docker ps
```

### **Stop Containers:**

```bash
docker-compose down
```

### **Rebuild & Restart:**

```bash
docker-compose up --build
```

### **View Logs:**

```bash
docker-compose logs -f
```

---

## ✅ Testing the API

Once the project is running, you can test it using:

- **GraphQL Playground** (`/graphql/` endpoint)
- **Postman** (Send GraphQL queries with JWT authentication)

---

## 🎉 Congratulations!

You have successfully set up the Free Mentors project using Docker! 🚀

For further support, open an issue on GitHub.

