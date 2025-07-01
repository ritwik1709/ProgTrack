# ProgTrack

A modern, collaborative project management web app for teams and individuals. Built with React, Node.js, Express, and MongoDB.

---

## 🚀 Features

- **Authentication:** Secure login/register with JWT
- **Project & Task Management:** Create projects, add/edit/delete tasks
- **Drag & Drop Board:** Organize tasks visually
- **Team Collaboration:** Invite users, assign roles (Owner, Member, Viewer), manage members
- **Role-Based Permissions:**
  - Owners: Full control (edit/delete project, manage members, tasks)
  - Members: Add/edit/delete tasks
  - Viewers: View-only access
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark Mode:** Beautiful light & dark themes
- **Modern UI:** Built with Tailwind CSS

---

## 🖥️ Screenshots

![Homepage](./screenshots/homepage.png)
![Project Board](./screenshots/board.png)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/progtrack.git
cd progtrack
```

### 2. Setup the Backend
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:9000

---

## 🔑 Environment Variables (Backend)
Create a `.env` file in `/backend`:
```
MONGO_URI=mongodb://localhost:27017/progtrack
JWT_SECRET=your_jwt_secret
```

---

## 🛠️ Project Structure
```
ProjManager/
  backend/    # Node.js/Express API
  frontend/   # React + Tailwind CSS frontend
```

---

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License
MIT

---

## 🙏 Acknowledgements
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [Headless UI](https://headlessui.dev/)

---

**Built with ❤️ for modern teams.**
