import express from 'express';
import { db } from '../database/connection.js';

const router = express.Router();

// Get all devices
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all devices');
    const devices = await db.selectFrom('devices').selectAll().execute();
    res.json(devices);
    return;
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
    return;
  }
});

// Get device by ID
router.get('/:id', async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    console.log('Fetching device with ID:', deviceId);
    
    const device = await db
      .selectFrom('devices')
      .selectAll()
      .where('id', '=', deviceId)
      .executeTakeFirst();
    
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }
    
    res.json(device);
    return;
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ error: 'Failed to fetch device' });
    return;
  }
});

// Create new device
router.post('/', async (req, res) => {
  try {
    const { name, type, ip_address, port, username, password, api_endpoint } = req.body;
    
    console.log('Creating new device:', { name, type, ip_address });
    
    const result = await db
      .insertInto('devices')
      .values({
        name,
        type,
        ip_address,
        port: port || 22,
        username,
        password,
        api_endpoint,
        status: 'inactive',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .executeTakeFirst();
    
    // Convert BigInt to number for JSON serialization
    const deviceId = Number(result.insertId);
    console.log('Device created with ID:', deviceId);
    
    res.status(201).json({ id: deviceId, message: 'Device created successfully' });
    return;
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Failed to create device' });
    return;
  }
});

// Update device
router.put('/:id', async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    const updates = req.body;
    
    console.log('Updating device:', deviceId, updates);
    
    await db
      .updateTable('devices')
      .set({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .where('id', '=', deviceId)
      .execute();
    
    res.json({ message: 'Device updated successfully' });
    return;
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ error: 'Failed to update device' });
    return;
  }
});

// Delete device
router.delete('/:id', async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    
    console.log('Deleting device:', deviceId);
    
    await db
      .deleteFrom('devices')
      .where('id', '=', deviceId)
      .execute();
    
    res.json({ message: 'Device deleted successfully' });
    return;
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Failed to delete device' });
    return;
  }
});

export default router;
