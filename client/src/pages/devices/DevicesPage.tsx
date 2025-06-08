import * as React from 'react';
import DevicesList from './DevicesList';
import AddDeviceDialog from './AddDeviceDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function DevicesPage() {
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Network Devices</h1>
          <p className="text-muted-foreground">
            Manage your Ruijie Gateway, Mikrotik Router, and OLT devices
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      <DevicesList />
      
      <AddDeviceDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}

export default DevicesPage;
