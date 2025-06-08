# Network Infrastructure Management System

A comprehensive web application for managing network infrastructure devices (Ruijie Gateway, Mikrotik Router, OLT) and their users (Hotspot and PPPoE services).

## Features

### Device Management
- **Multi-Device Support**: Manage Ruijie Gateway, Mikrotik Router, and OLT devices
- **Device Configuration**: Store device credentials, IP addresses, and API endpoints
- **Status Monitoring**: Track device status and last seen timestamps
- **Device Types**: Support for different network device types with appropriate configurations

### User Management
- **Service Types**: Support for both Hotspot and PPPoE user services
- **User Profiles**: Assign users to specific profiles and devices
- **Session Tracking**: Monitor user sessions, data usage, and connection time
- **User Status**: Active, disabled, and expired user states
- **Expiry Management**: Set user account expiration dates

### Dashboard & Monitoring
- **Real-time Overview**: Dashboard showing device and user statistics
- **Network Status**: Monitor overall network health and bandwidth usage
- **Activity Logs**: Track device activities and user sessions
- **Data Visualization**: Clear presentation of network statistics

### Technical Features
- **SQLite Database**: Lightweight database for storing all application data
- **RESTful API**: Well-structured API endpoints for all operations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface built with React and shadcn/ui components

## Quick Start

1. **Install Prerequisites**:
   - Node.js 18+ ([Download here](https://nodejs.org/))
   - Git ([Download here](https://git-scm.com/))

2. **Install the Application**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run start
   ```

4. **Access the Application**:
   - Open your browser to `http://localhost:3000`

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## Technology Stack

### Frontend
- **React 18**: Modern React with functional components and hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

### Backend
- **Node.js**: JavaScript runtime
- **Express 5**: Web framework with modern features
- **TypeScript**: Type-safe server development
- **Kysely**: Type-safe SQL query builder
- **SQLite**: Lightweight database
- **better-sqlite3**: Fast SQLite driver

### Development Tools
- **Vite**: Fast development server and build tool
- **tsx**: TypeScript execution for development
- **ESM**: Modern ES modules throughout

## API Endpoints

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create new device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `GET /api/devices/:id` - Get device details

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/device/:deviceId` - Get users by device
- `GET /api/users/stats` - Get user statistics

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Database Schema

The application uses SQLite with the following main tables:

### devices
- Device information (name, type, IP, credentials)
- Support for Ruijie, Mikrotik, and OLT devices
- Status tracking and API endpoint configuration

### network_users
- User accounts for Hotspot and PPPoE services
- Profile assignments and device associations
- Data usage and session time tracking

### user_sessions
- Active and historical user sessions
- Session timing and data transfer tracking

### device_logs
- Device activity and error logging
- Structured logging with levels and JSON data

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── database/           # Database schema and connection
│   ├── routes/             # API route handlers
│   └── index.ts            # Server entry point
├── scripts/                # Development scripts
└── data/                   # SQLite database storage
```

## Development

### Available Scripts
- `npm run start` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run dev` - Alternative development command

### Environment Variables
- `PORT` - Server port (default: 3001)
- `DATA_DIRECTORY` - Database storage path (default: ./data)
- `NODE_ENV` - Environment mode (development/production)

## Integration Capabilities

The application is designed to integrate with:

### Mikrotik RouterOS
- API support for user management
- Hotspot and PPPoE service integration
- Real-time user session monitoring

### Ruijie Gateway
- Device configuration and monitoring
- User authentication integration
- Network policy management

### OLT (Optical Line Terminal)
- Fiber network user management
- Service provisioning
- Performance monitoring

## Use Cases

### Internet Service Providers (ISPs)
- Manage customer accounts across multiple devices
- Monitor network usage and performance
- Automate user provisioning and billing integration

### Network Administrators
- Centralized device and user management
- Real-time monitoring and troubleshooting
- Comprehensive logging and reporting

### Enterprise Networks
- Employee network access management
- Guest access control through hotspot services
- Network resource monitoring

## Future Enhancements

- Real-time device integration with Mikrotik API
- Ruijie Gateway API integration
- Advanced reporting and analytics
- User portal for self-service
- Billing system integration
- SNMP monitoring capabilities
- Multi-tenant support

## License

This project is available for use under standard licensing terms.

## Support

For installation help, see [INSTALLATION.md](INSTALLATION.md).
For technical issues, check the application logs and error messages.
