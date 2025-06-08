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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Network Device</DialogTitle>
          <DialogDescription>
            Add a new device to your network infrastructure
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
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Device</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDeviceDialog;
