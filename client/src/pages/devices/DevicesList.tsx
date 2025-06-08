import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Router, Settings, Trash2, Wifi, WifiOff } from 'lucide-react';

function DevicesList() {
  const [devices, setDevices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [testingConnection, setTestingConnection] = React.useState<number | null>(null);

  React.useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (deviceId: number) => {
    setTestingConnection(deviceId);
    try {
      const response = await fetch(`/api/devices/${deviceId}/test-connection`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (response.ok) {
        // Refresh the devices list to show updated status
        await fetchDevices();
        alert(result.message);
      } else {
        alert('Failed to test connection: ' + result.error);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Failed to test connection');
    } finally {
      setTestingConnection(null);
    }
  };

  const deleteDevice = async (deviceId: number, deviceName: string) => {
    if (window.confirm(`Are you sure you want to delete "${deviceName}"?`)) {
      try {
        const response = await fetch(`/api/devices/${deviceId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchDevices();
          alert('Device deleted successfully');
        } else {
          const result = await response.json();
          alert('Failed to delete device: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Failed to delete device');
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Wifi className="h-4 w-4" />;
      case 'error':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Router className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No devices found</h3>
          <p className="text-muted-foreground text-center">
            Get started by adding your first network device
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device: any) => (
        <Card key={device.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Router className="h-5 w-5" />
                <span>{device.name}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                {getStatusIcon(device.status)}
                <Badge variant={getStatusBadgeVariant(device.status)}>
                  {device.status}
                </Badge>
              </div>
            </div>
            <CardDescription>
              {device.type.toUpperCase()} - {device.ip_address}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Type:</span> {device.type}
              </div>
              <div className="text-sm">
                <span className="font-medium">Port:</span> {device.port}
              </div>
              {device.last_seen && (
                <div className="text-sm">
                  <span className="font-medium">Last Seen:</span>{' '}
                  {new Date(device.last_seen).toLocaleString()}
                </div>
              )}
              {device.status === 'error' && (
                <div className="text-sm text-destructive">
                  <span className="font-medium">Status:</span> Connection failed
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => testConnection(device.id)}
                disabled={testingConnection === device.id}
              >
                <Wifi className="h-4 w-4 mr-1" />
                {testingConnection === device.id ? 'Testing...' : 'Test'}
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => deleteDevice(device.id, device.name)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DevicesList;
