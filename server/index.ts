import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import devicesRouter from './routes/devices.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/devices', devicesRouter);
app.use('/api/users', usersRouter);

// Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('Fetching dashboard data');
    // This would be expanded to include real-time statistics
    res.json({
      devices: { total: 0, active: 0, inactive: 0 },
      users: { total: 0, active: 0, hotspot: 0, pppoe: 0 },
      bandwidth: { total_in: 0, total_out: 0 }
    });
    return;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
    return;
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`Network Management API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Network Management server...');
  startServer(process.env.PORT || 3001);
}
