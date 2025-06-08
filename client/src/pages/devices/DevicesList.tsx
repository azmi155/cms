import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Router, Settings, Trash2 } from 'lucide-react';

function DevicesList() {
  const [devices, setDevices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
              <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                {device.status}
              </Badge>
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
            </div>
            <div className="flex space-x-2 mt-4">
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
              <Button size="sm" variant="outline">
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
