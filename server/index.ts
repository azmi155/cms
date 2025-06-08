import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/connection.js';
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

// Dashboard endpoint with real data
app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('Fetching dashboard data');
    
    // Get device statistics
    const deviceStats = await db
      .selectFrom('devices')
      .select([
        db.fn.count('id').as('total'),
        db.fn.countAll().filterWhere('status', '=', 'active').as('active'),
        db.fn.countAll().filterWhere('status', '=', 'inactive').as('inactive'),
        db.fn.countAll().filterWhere('status', '=', 'error').as('error')
      ])
      .executeTakeFirst();
    
    // Get user statistics
    const userStats = await db
      .selectFrom('network_users')
      .select([
        db.fn.count('id').as('total'),
        db.fn.countAll().filterWhere('status', '=', 'active').as('active'),
        db.fn.countAll().filterWhere('service_type', '=', 'hotspot').as('hotspot'),
        db.fn.countAll().filterWhere('service_type', '=', 'pppoe').as('pppoe')
      ])
      .executeTakeFirst();
    
    // Get bandwidth usage
    const bandwidthStats = await db
      .selectFrom('network_users')
      .select([
        db.fn.sum('bytes_in').as('total_in'),
        db.fn.sum('bytes_out').as('total_out')
      ])
      .executeTakeFirst();
    
    const dashboardData = {
      devices: {
        total: Number(deviceStats?.total || 0),
        active: Number(deviceStats?.active || 0),
        inactive: Number(deviceStats?.inactive || 0),
        error: Number(deviceStats?.error || 0)
      },
      users: {
        total: Number(userStats?.total || 0),
        active: Number(userStats?.active || 0),
        hotspot: Number(userStats?.hotspot || 0),
        pppoe: Number(userStats?.pppoe || 0)
      },
      bandwidth: {
        total_in: Number(bandwidthStats?.total_in || 0),
        total_out: Number(bandwidthStats?.total_out || 0)
      }
    };
    
    console.log('Dashboard data:', dashboardData);
    res.json(dashboardData);
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
