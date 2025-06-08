import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    service_type: '',
    device_id: '',
    profile: '',
    expiry_date: ''
  });
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      fetchDevices();
    }
  }, [open]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          device_id: parseInt(formData.device_id)
        }),
      });

      if (response.ok) {
        onOpenChange(false);
        setFormData({
          username: '',
          password: '',
          service_type: '',
          device_id: '',
          profile: '',
          expiry_date: ''
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Network User</DialogTitle>
          <DialogDescription>
            Create a new user account for Hotspot or PPPoE service
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="user123"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_type">Service Type</Label>
            <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotspot">Hotspot</SelectItem>
                <SelectItem value="pppoe">PPPoE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_id">Device</Label>
            <Select value={formData.device_id} onValueChange={(value) => handleInputChange('device_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device: any) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.name} ({device.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">Profile (Optional)</Label>
            <Input
              id="profile"
              placeholder="default"
              value={formData.profile}
              onChange={(e) => handleInputChange('profile', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserDialog;
