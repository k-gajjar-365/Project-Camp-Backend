# 🏕️ Project Camp Backend

**Version:** 1.0.0  
**Type:** RESTful API for Collaborative Project Management  
**Status:** In Development 🚧

Project Camp Backend is a robust and scalable REST API designed to streamline team collaboration through structured project, task, and user management. Built with security and flexibility in mind, it supports role-based access control, hierarchical task organization, and secure file handling.

---


## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based login and refresh token system
- Email verification and password reset
- Role-based access control (Admin, Project Admin, Member)

### 📁 Project Management
- Create, update, delete projects
- Invite and manage team members
- Assign roles and permissions

### ✅ Task & Subtask Management
- Create tasks with file attachments
- Assign tasks and track status (Todo, In Progress, Done)
- Add and manage subtasks with completion tracking

### 📝 Project Notes
- Admin-only note creation and editing
- View notes across projects

### 📡 System Health
- Health check endpoint for monitoring API status

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT, Email Tokens
- **File Uploads:** Multer
- **Security:** Helmet, CORS, Input Validation

---

## 📂 API Structure

All endpoints are prefixed with `/api/v1/`

### 🔑 Auth Routes
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/current-user`
- `POST /auth/change-password`
- `POST /auth/refresh-token`
- `GET /auth/verify-email/:token`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `POST /auth/resend-email-verification`

### 📦 Project Routes
- `GET /projects/`
- `POST /projects/`
- `GET /projects/:projectId`
- `PUT /projects/:projectId`
- `DELETE /projects/:projectId`
- `GET /projects/:projectId/members`
- `POST /projects/:projectId/members`
- `PUT /projects/:projectId/members/:userId`
- `DELETE /projects/:projectId/members/:userId`

### 📋 Task Routes
- `GET /tasks/:projectId`
- `POST /tasks/:projectId`
- `GET /tasks/:projectId/t/:taskId`
- `PUT /tasks/:projectId/t/:taskId`
- `DELETE /tasks/:projectId/t/:taskId`
- `POST /tasks/:projectId/t/:taskId/subtasks`
- `PUT /tasks/:projectId/st/:subTaskId`
- `DELETE /tasks/:projectId/st/:subTaskId`

### 🗒️ Note Routes
- `GET /notes/:projectId`
- `POST /notes/:projectId`
- `GET /notes/:projectId/n/:noteId`
- `PUT /notes/:projectId/n/:noteId`
- `DELETE /notes/:projectId/n/:noteId`

### 🩺 Health Check
- `GET /healthcheck/`

---

## 👥 User Roles & Permissions

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | ----- | ------------- | ------ |
| Create Project             | ✅     | ❌             | ❌      |
| Update/Delete Project      | ✅     | ❌             | ❌      |
| Manage Project Members     | ✅     | ❌             | ❌      |
| Create/Update/Delete Tasks | ✅     | ✅             | ❌      |
| View Tasks                 | ✅     | ✅             | ✅      |
| Update Subtask Status      | ✅     | ✅             | ✅      |
| Create/Delete Subtasks     | ✅     | ✅             | ❌      |
| Create/Update/Delete Notes | ✅     | ❌             | ❌      |
| View Notes                 | ✅     | ✅             | ✅      |

---

## 🔒 Security Highlights

- JWT authentication with refresh tokens
- Email verification and secure password reset
- Input validation and sanitization
- CORS configuration for safe cross-origin access
- File upload security via Multer

---

## 📎 File Management

- Multiple file attachments per task
- Metadata tracking (URL, MIME type, size)
- Files stored in `public/images/`
- Secure upload handling

---

## ⚙️ Setup Instructions

1. Clone the repository  
   `git clone https://github.com/your-username/project-camp-backend.git`

2. Install dependencies  
   `npm install`

3. Create `.env` file with required environment variables  
