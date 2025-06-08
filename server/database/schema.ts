export interface DevicesTable {
  id: number;
  name: string;
  type: 'ruijie' | 'mikrotik' | 'olt';
  ip_address: string;
  port: number;
  username: string | null;
  password: string | null;
  api_endpoint: string | null;
  status: 'active' | 'inactive' | 'error';
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}

export interface NetworkUsersTable {
  id: number;
  username: string;
  password: string;
  service_type: 'hotspot' | 'pppoe';
  device_id: number;
  status: 'active' | 'disabled' | 'expired';
  profile: string | null;
  ip_address: string | null;
  mac_address: string | null;
  bytes_in: number;
  bytes_out: number;
  session_time: number;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSessionsTable {
  id: number;
  user_id: number;
  session_id: string | null;
  ip_address: string | null;
  mac_address: string | null;
  bytes_in: number;
  bytes_out: number;
  session_time: number;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'terminated';
}

export interface DeviceLogsTable {
  id: number;
  device_id: number;
  log_level: 'info' | 'warning' | 'error';
  message: string;
  data: string | null;
  created_at: string;
}

export interface DatabaseSchema {
  devices: DevicesTable;
  network_users: NetworkUsersTable;
  user_sessions: UserSessionsTable;
  device_logs: DeviceLogsTable;
}
