import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    ip_address: '',
    port: '22',
    username: '',
    password: '',
    api_endpoint: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        onOpenChange(false);
        setFormData({
          name: '',
          type: '',
          ip_address: '',
          port: '22',
          username: '',
          password: '',
          api_endpoint: ''
        });
        
        // Show result of connection test
        if (result.connected) {
          alert(`Device "${formData.name}" added successfully and is connected!`);
        } else {
          alert(`Device "${formData.name}" added but connection failed. You can test the connection again from the devices list.`);
        }
        
        window.location.reload();
      } else {
        alert('Failed to create device: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating device:', error);
      alert('Failed to create device');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDefaultPort = (deviceType: string) => {
    switch (deviceType) {
      case 'mikrotik':
        return '8728'; // RouterOS API port
      case 'ruijie':
        return '22'; // SSH port
      case 'olt':
        return '161'; // SNMP port
      default:
        return '22';
    }
  };

  const handleTypeChange = (value: string) => {
    handleInputChange('type', value);
    // Auto-update port based on device type
    const defaultPort = getDefaultPort(value);
    handleInputChange('port', defaultPort);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Network Device</DialogTitle>
          <DialogDescription>
            Add a new device to your network infrastructure. The system will automatically test the connection.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              placeholder="e.g., Main Router"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Device Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ruijie">Ruijie Gateway</SelectItem>
                <SelectItem value="mikrotik">Mikrotik Router</SelectItem>
                <SelectItem value="olt">OLT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ip_address">IP Address</Label>
            <Input
              id="ip_address"
              placeholder="192.168.1.1"
              value={formData.ip_address}
              onChange={(e) => handleInputChange('ip_address', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              placeholder="22"
              value={formData.port}
              onChange={(e) => handleInputChange('port', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {formData.type === 'mikrotik' && 'Default: 8728 (RouterOS API)'}
              {formData.type === 'ruijie' && 'Default: 22 (SSH)'}
              {formData.type === 'olt' && 'Default: 161 (SNMP)'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="admin"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_endpoint">API Endpoint (Optional)</Label>
            <Input
              id="api_endpoint"
              placeholder="http://192.168.1.1:8728"
              value={formData.api_endpoint}
              onChange={(e) => handleInputChange('api_endpoint', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Device...' : 'Add Device'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDeviceDialog;
