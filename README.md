<div align="center">

# Dumb.ai

### Your Second Brain, Supercharged.

A neobrutalist, AI-powered note-taking app that connects your ideas with knowledge graphs, real-time sync, and Gemini-powered insights.

[![Made with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📸 Preview

| Landing Page | Dashboard | Knowledge Graph |
|:---:|:---:|:---:|
| Neobrutalist hero with animated stats & feature cards | Pin, tag, and manage notes at a glance | Visualize connections between your ideas |

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Smart Notes** | Rich text editing with auto-save, tagging, and pinning |
| 🔗 **Backlinks** | Bi-directional linking — every note knows what references it |
| 🕸️ **Knowledge Graph** | Interactive node-based visualization of note connections (React Flow) |
| 🤖 **AI Insights** | Gemini-powered summaries & intelligent tag suggestions |
| 🔍 **Full-text Search** | Instant search across all notes with `Ctrl+K` shortcut |
| 📌 **Pin & Prioritize** | Pin important notes to keep your best thinking front and center |
| ⚡ **Real-time Sync** | WebSocket-powered live updates via Socket.io |
| 🔐 **Authentication** | Secure JWT-based auth with bcrypt password hashing |
| 🎨 **Neobrutalist UI** | Bold, opinionated design with brutal shadows, thick borders, and vibrant colors |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — Lightning-fast build tool
- **Tailwind CSS v4** — Utility-first styling with custom neobrutalist theme
- **Zustand** — Lightweight state management
- **React Router v7** — Client-side routing
- **React Flow** — Knowledge graph visualization
- **Lucide React** — Icon library
- **Socket.io Client** — Real-time communication

### Backend
- **Express 5** — Web framework
- **MongoDB + Mongoose 9** — Database & ODM
- **Socket.io** — WebSocket server for live sync
- **Google Gemini AI** (`@google/genai`) — AI summarization & tag suggestions
- **JWT + bcryptjs** — Authentication & password hashing
- **Axios** — HTTP client (keep-alive pings for Render hosting)

---

## 📁 Project Structure

```
dumb.ai/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # App shell with sidebar & mobile nav
│   │   │   └── SearchModal.jsx    # Ctrl+K search overlay
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Public landing page
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── Register.jsx       # User registration
│   │   │   ├── Dashboard.jsx      # Note cards grid
│   │   │   ├── NoteEditor.jsx     # Rich note editing
│   │   │   ├── GraphView.jsx      # Knowledge graph
│   │   │   └── AIInsights.jsx     # AI summaries & suggestions
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── store/
│   │   │   └── useStore.js        # Zustand global store
│   │   ├── App.jsx                # Router & route guards
│   │   └── index.css              # Tailwind config & brutal theme
│   └── package.json
│
├── server/                    # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Note.js                # Note schema (with text index)
│   ├── routes/
│   │   ├── authRoutes.js          # Login / Register
│   │   ├── noteRoutes.js          # CRUD + search + pin
│   │   ├── aiRoutes.js            # Gemini summarize & suggest
│   │   └── graphRoutes.js         # Knowledge graph data
│   ├── services/
│   │   └── geminiService.js       # Google Gemini AI integration
│   ├── server.js                  # Entry point + Socket.io setup
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### 1. Clone the repo

```bash
git clone https://github.com/Bisha18/dumb.ai.git
cd dumb.ai
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dumbai
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd client
npm install
npm run dev
```

The app will be running at **http://localhost:5173** 🎉

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Login & receive JWT |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | Get all user notes |
| `POST` | `/api/notes` | Create a new note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/summarize` | AI-generated note summary |
| `POST` | `/api/ai/suggest` | AI-suggested tags/links |

### Graph
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/graph` | Get knowledge graph data |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |

---

## 🎨 Design System

Dumb.ai uses a custom **neobrutalist** design system built on Tailwind CSS v4:

```css
/* Core Palette */
--color-neo-yellow: #ffde59    /* Primary accent */
--color-neo-black:  #111111    /* Text & borders */
--color-neo-white:  #f5f5f5    /* Background */
--color-neo-blue:   #3b82f6    /* Interactive elements */
--color-neo-red:    #ef4444    /* Destructive actions */

/* Brutal Shadows */
--box-shadow-brutal:       4px 4px 0px 0px rgba(0,0,0,1)
--box-shadow-brutal-hover: 6px 6px 0px 0px rgba(0,0,0,1)
```

---

## 🌐 Deployment

The app is designed to be deployed on **Render** (free tier):

- **Backend**: Deploy as a Web Service with `npm start`
- **Frontend**: Deploy as a Static Site with `npm run build`
- The server includes a built-in **keep-alive ping** mechanism to prevent Render's free tier from sleeping

---

## 🛣️ Roadmap

- [ ] Markdown editor with live preview
- [ ] Collaborative real-time editing
- [ ] Export notes to PDF / Markdown
- [ ] Mobile app (React Native)
- [ ] Custom AI prompts
- [ ] Folder / workspace support
- [ ] Dark mode toggle

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Built with ❤️ by [Bisha18](https://github.com/Bisha18)**

*Stop forgetting. Start building your brain.* 🧠

</div>
