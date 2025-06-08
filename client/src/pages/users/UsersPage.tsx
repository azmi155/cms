import * as React from 'react';
import UsersList from './UsersList';
import AddUserDialog from './AddUserDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function UsersPage() {
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Network Users</h1>
          <p className="text-muted-foreground">
            Manage Hotspot and PPPoE users across your network
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <UsersList />
      
      <AddUserDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}

export default UsersPage;
