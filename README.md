# 🏕️ Project Camp Backend

**Version:** 1.0.0  
**Type:** RESTful API for Collaborative Project Management  
**Status:** In Development 🚧

Project Camp Backend is a robust and scalable REST API designed to streamline team collaboration through structured project, task, and user management. Built with security and flexibility in mind, it supports role-based access control, hierarchical task organization, and secure file handling.

---


## 🚧 Development Status

| Module            | Status       | Notes                                      |
|-------------------|--------------|--------------------------------------------|
| 🔐 Authentication | ✅ Completed | All authentication routes implemented and tested |
| 🩺 Health Check   | ✅ Completed | System status endpoint implemented and working |
| 📦 Projects       | ⏳ Pending    | Project creation, listing, and updates in progress |
| 👥 Members        | ⏳ Pending    | Member invitation and role management routes underway |
| 📋 Tasks/Subtasks | ⏳ Pending    | Task CRUD and subtask logic to be added soon |
| 📝 Notes          | ⏳ Pending    | Note creation and access routes planned for next phase |



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
- **Security:** CORS, Input Validation

---

## 📂 API Structure

### Authentication Routes `/api/v1/auth/`


- `POST /register` - User registration

- `POST /login` - User authentication
- `POST /logout` - User logout (secured)
- `GET /current-user` - Get current user info (secured)
- `POST /change-password` - Change user password (secured)
- `POST /refresh-token` - Refresh access token
- `GET /verify-email/:verificationToken` - Email verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:resetToken` - Reset forgotten password
- `POST /resend-email-verification` - Resend verification email (secured)

### Project Routes `/api/v1/projects/`

- `GET /` - List user projects (secured)

- `POST /` - Create project (secured)
- `GET /:projectId` - Get project details (secured, role-based)
- `PUT /:projectId` - Update project (secured, Admin only)
- `DELETE /:projectId` - Delete project (secured, Admin only)
- `GET /:projectId/members` - List project members (secured)
- `POST /:projectId/members` - Add project member (secured, Admin only)
- `PUT /:projectId/members/:userId` - Update member role (secured, Admin only)
- `DELETE /:projectId/members/:userId` - Remove member (secured, Admin only)

### Task Routes `/api/v1/tasks/`

- `GET /:projectId` - List project tasks (secured, role-based)

- `POST /:projectId` - Create task (secured, Admin/Project Admin)
- `GET /:projectId/t/:taskId` - Get task details (secured, role-based)
- `PUT /:projectId/t/:taskId` - Update task (secured, Admin/Project Admin)
- `DELETE /:projectId/t/:taskId` - Delete task (secured, Admin/Project Admin)
- `POST /:projectId/t/:taskId/subtasks` - Create subtask (secured, Admin/Project Admin)
- `PUT /:projectId/st/:subTaskId` - Update subtask (secured, role-based)
- `DELETE /:projectId/st/:subTaskId` - Delete subtask (secured, Admin/Project Admin)

### Note Routes `/api/v1/notes/`
- `GET /:projectId` - List project notes (secured, role-based)

- `POST /:projectId` - Create note (secured, Admin only)
- `GET /:projectId/n/:noteId` - Get note details (secured, role-based)
- `PUT /:projectId/n/:noteId` - Update note (secured, Admin only)
- `DELETE /:projectId/n/:noteId` - Delete note (secured, Admin only)

### Health Check `/api/v1/healthcheck/`

- `GET /` - System health status

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

## ⚙️ Setup Instructions

1. Clone the repository  
   `git clone https://github.com/k-gajjar-365/Project-Camp-Backend.git`

2. Install dependencies  
   `npm install`

3. Create `.env` file with required environment variables  
