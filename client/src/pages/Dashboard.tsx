import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Router, Users, Activity, Network } from 'lucide-react';

function Dashboard() {
  const [dashboardData, setDashboardData] = React.useState({
    devices: { total: 0, active: 0, inactive: 0, error: 0 },
    users: { total: 0, active: 0, hotspot: 0, pppoe: 0 },
    bandwidth: { total_in: 0, total_out: 0 }
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getNetworkStatus = () => {
    if (dashboardData.devices.error > 0) {
      return { status: 'Issues Detected', color: 'text-destructive' };
    } else if (dashboardData.devices.active > 0) {
      return { status: 'Healthy', color: 'text-green-600' };
    } else {
      return { status: 'No Devices', color: 'text-muted-foreground' };
    }
  };

  const networkStatus = getNetworkStatus();
  const totalBandwidth = dashboardData.bandwidth.total_in + dashboardData.bandwidth.total_out;

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Network Infrastructure Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your network devices and users
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Router className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.devices.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.devices.active} active, {dashboardData.devices.inactive} inactive
              {dashboardData.devices.error > 0 && `, ${dashboardData.devices.error} errors`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.users.active}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.users.hotspot} Hotspot, {dashboardData.users.pppoe} PPPoE
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${networkStatus.color}`}>
              {networkStatus.status}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.devices.active} of {dashboardData.devices.total} devices online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalBandwidth)}</div>
            <p className="text-xs text-muted-foreground">
              Total data transferred
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Summary</CardTitle>
            <CardDescription>
              Overview of your network devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.devices.total === 0 ? (
              <div className="text-sm text-muted-foreground">
                No devices configured yet
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Devices:</span>
                  <span className="font-medium text-green-600">{dashboardData.devices.active}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inactive Devices:</span>
                  <span className="font-medium text-muted-foreground">{dashboardData.devices.inactive}</span>
                </div>
                {dashboardData.devices.error > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Error Devices:</span>
                    <span className="font-medium text-destructive">{dashboardData.devices.error}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Summary</CardTitle>
            <CardDescription>
              Active user connections and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.users.total === 0 ? (
              <div className="text-sm text-muted-foreground">
                No users configured yet
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Users:</span>
                  <span className="font-medium">{dashboardData.users.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Users:</span>
                  <span className="font-medium text-green-600">{dashboardData.users.active}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hotspot Users:</span>
                  <span className="font-medium">{dashboardData.users.hotspot}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>PPPoE Users:</span>
                  <span className="font-medium">{dashboardData.users.pppoe}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
