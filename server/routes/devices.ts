import express from 'express';
import { db } from '../database/connection.js';

const router = express.Router();

// Test device connection
async function testDeviceConnection(device: any): Promise<boolean> {
  try {
    console.log(`Testing connection to ${device.type} device at ${device.ip_address}:${device.port}`);
    
    // For now, we'll simulate connection testing
    // In a real implementation, you would:
    // - For Mikrotik: Use RouterOS API to test connection
    // - For Ruijie: Use SSH or HTTP API to test connection  
    // - For OLT: Use SNMP or vendor-specific API
    
    // Simulate a connection test with random success/failure
    const isConnected = Math.random() > 0.3; // 70% success rate for demo
    
    if (isConnected) {
      console.log(`✅ Successfully connected to ${device.name}`);
      return true;
    } else {
      console.log(`❌ Failed to connect to ${device.name}`);
      return false;
    }
  } catch (error) {
    console.error(`Error testing connection to ${device.name}:`, error);
    return false;
  }
}

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

// Test device connection endpoint
router.post('/:id/test-connection', async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    console.log('Testing connection for device ID:', deviceId);
    
    const device = await db
      .selectFrom('devices')
      .selectAll()
      .where('id', '=', deviceId)
      .executeTakeFirst();
    
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }
    
    const isConnected = await testDeviceConnection(device);
    const newStatus = isConnected ? 'active' : 'error';
    const currentTime = new Date().toISOString();
    
    // Update device status
    await db
      .updateTable('devices')
      .set({
        status: newStatus,
        last_seen: isConnected ? currentTime : null,
        updated_at: currentTime
      })
      .where('id', '=', deviceId)
      .execute();
    
    // Log the connection test
    await db
      .insertInto('device_logs')
      .values({
        device_id: deviceId,
        log_level: isConnected ? 'info' : 'error',
        message: isConnected ? 'Connection test successful' : 'Connection test failed',
        data: JSON.stringify({
          ip_address: device.ip_address,
          port: device.port,
          test_time: currentTime
        }),
        created_at: currentTime
      })
      .execute();
    
    res.json({
      success: isConnected,
      status: newStatus,
      message: isConnected ? 'Device connected successfully' : 'Failed to connect to device',
      last_seen: isConnected ? currentTime : null
    });
    return;
  } catch (error) {
    console.error('Error testing device connection:', error);
    res.status(500).json({ error: 'Failed to test device connection' });
    return;
  }
});

// Create new device
router.post('/', async (req, res) => {
  try {
    const { name, type, ip_address, port, username, password, api_endpoint } = req.body;
    
    console.log('Creating new device:', { name, type, ip_address });
    
    const currentTime = new Date().toISOString();
    
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
        created_at: currentTime,
        updated_at: currentTime
      })
      .executeTakeFirst();
    
    const deviceId = Number(result.insertId);
    console.log('Device created with ID:', deviceId);
    
    // Automatically test connection for the new device
    const newDevice = {
      id: deviceId,
      name,
      type,
      ip_address,
      port: port || 22,
      username,
      password,
      api_endpoint
    };
    
    const isConnected = await testDeviceConnection(newDevice);
    const deviceStatus = isConnected ? 'active' : 'error';
    
    // Update the device status after connection test
    await db
      .updateTable('devices')
      .set({
        status: deviceStatus,
        last_seen: isConnected ? currentTime : null,
        updated_at: currentTime
      })
      .where('id', '=', deviceId)
      .execute();
    
    // Log the initial connection test
    await db
      .insertInto('device_logs')
      .values({
        device_id: deviceId,
        log_level: 'info',
        message: `Device created and ${isConnected ? 'connection successful' : 'connection failed'}`,
        data: JSON.stringify({
          ip_address,
          port: port || 22,
          initial_test: true,
          connected: isConnected
        }),
        created_at: currentTime
      })
      .execute();
    
    res.status(201).json({
      id: deviceId,
      message: 'Device created successfully',
      status: deviceStatus,
      connected: isConnected
    });
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
