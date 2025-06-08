import express from 'express';
import { db } from '../database/connection.js';

const router = express.Router();

// Get all network users
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all network users');
    const users = await db
      .selectFrom('network_users')
      .leftJoin('devices', 'devices.id', 'network_users.device_id')
      .select([
        'network_users.id',
        'network_users.username',
        'network_users.service_type',
        'network_users.status',
        'network_users.profile',
        'network_users.ip_address',
        'network_users.mac_address',
        'network_users.bytes_in',
        'network_users.bytes_out',
        'network_users.session_time',
        'network_users.expiry_date',
        'network_users.created_at',
        'devices.name as device_name',
        'devices.type as device_type'
      ])
      .execute();
    
    res.json(users);
    return;
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
});

// Get users by device
router.get('/device/:deviceId', async (req, res) => {
  try {
    const deviceId = parseInt(req.params.deviceId);
    console.log('Fetching users for device:', deviceId);
    
    const users = await db
      .selectFrom('network_users')
      .selectAll()
      .where('device_id', '=', deviceId)
      .execute();
    
    res.json(users);
    return;
  } catch (error) {
    console.error('Error fetching users by device:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, password, service_type, device_id, profile, expiry_date } = req.body;
    
    console.log('Creating new user:', { username, service_type, device_id });
    
    const result = await db
      .insertInto('network_users')
      .values({
        username,
        password,
        service_type,
        device_id,
        profile,
        expiry_date,
        status: 'active',
        bytes_in: 0,
        bytes_out: 0,
        session_time: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .executeTakeFirst();
    
    // Convert BigInt to number for JSON serialization
    const userId = Number(result.insertId);
    console.log('User created with ID:', userId);
    
    res.status(201).json({ id: userId, message: 'User created successfully' });
    return;
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    
    console.log('Updating user:', userId, updates);
    
    await db
      .updateTable('network_users')
      .set({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .where('id', '=', userId)
      .execute();
    
    res.json({ message: 'User updated successfully' });
    return;
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
    return;
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    console.log('Deleting user:', userId);
    
    await db
      .deleteFrom('network_users')
      .where('id', '=', userId)
      .execute();
    
    res.json({ message: 'User deleted successfully' });
    return;
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
    return;
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching user statistics');
    
    const stats = await db
      .selectFrom('network_users')
      .select([
        db.fn.count('id').as('total_users'),
        db.fn.countAll().filterWhere('status', '=', 'active').as('active_users'),
        db.fn.countAll().filterWhere('service_type', '=', 'hotspot').as('hotspot_users'),
        db.fn.countAll().filterWhere('service_type', '=', 'pppoe').as('pppoe_users')
      ])
      .executeTakeFirst();
    
    res.json(stats);
    return;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
    return;
  }
});

export default router;
