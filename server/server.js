require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const aiRoutes = require('./routes/aiRoutes');
const graphRoutes = require('./routes/graphRoutes');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Enable CORS and Socket.io with CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io); // Accessible in routes via req.app.get('io')

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Second Brain OS API is running');
});

// Health check endpoint for Render keep-alive
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/graph', graphRoutes);

// Keep-alive mechanism for Render free tier
const startKeepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
  if (!url) {
    console.log('Keep-alive: No external URL provided. Skipping.');
    return;
  }

  console.log(`Keep-alive: Monitoring ${url}/api/health`);
  setInterval(async () => {
    try {
      const response = await axios.get(`${url}/api/health`);
      console.log(`Keep-alive: Ping successful (${response.status}) at ${new Date().toISOString()}`);
    } catch (error) {
      console.error(`Keep-alive: Ping failed at ${new Date().toISOString()}: ${error.message}`);
    }
  }, 50000); // 50 seconds
};

if (process.env.NODE_ENV === 'production') {
  startKeepAlive();
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
