# Network Infrastructure Management Application - Installation Guide

## Prerequisites

Before installing this application, make sure you have the following software installed on your computer:

### 1. Node.js (Required)
- **Version**: Node.js 18 or higher
- **Download**: Visit [https://nodejs.org/](https://nodejs.org/)
- **Installation**: Download and install the LTS (Long Term Support) version for your operating system

### 2. Git (Required)
- **Download**: Visit [https://git-scm.com/](https://git-scm.com/)
- **Installation**: Download and install Git for your operating system

## Installation Steps

### Step 1: Download the Application

If you have the code as files, create a new folder and copy all the files there. If you have a Git repository, clone it:

```bash
git clone <repository-url>
cd <project-folder>
```

### Step 2: Install Dependencies

Open a terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install all required dependencies for both the frontend and backend.

### Step 3: Create Data Directory

The application needs a data directory to store the SQLite database. Create it manually:

```bash
# On Windows (Command Prompt)
mkdir data

# On Windows (PowerShell)
New-Item -ItemType Directory -Name "data"

# On macOS/Linux
mkdir data
```

### Step 4: Set Environment Variables (Optional)

Create a `.env` file in the root directory with the following content:

```env
# Port for the application (default: 3001)
PORT=3001

# Data directory path (default: ./data)
DATA_DIRECTORY=./data

# Environment (development/production)
NODE_ENV=development
```

## Running the Application

### Development Mode (Recommended for first-time users)

1. Open a terminal/command prompt in the project folder
2. Run the development server:

```bash
npm run start
```

3. Wait for the application to start. You should see messages like:
   ```
   Network Management API Server running on port 3001
   Vite dev server running on port 3000
   ```

4. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Set the environment to production:
```bash
# On Windows (Command Prompt)
set NODE_ENV=production

# On Windows (PowerShell)
$env:NODE_ENV="production"

# On macOS/Linux
export NODE_ENV=production
```

3. Start the production server:
```bash
node dist/server/index.js
```

4. Open your web browser and go to:
   ```
   http://localhost:3001
   ```

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
If you get an error about port 3000 or 3001 being in use:
- Change the PORT in your `.env` file to a different number (e.g., 3002)
- Or stop other applications using those ports

#### 2. Permission Errors
If you get permission errors when creating the data directory:
- On Windows: Run Command Prompt as Administrator
- On macOS/Linux: Use `sudo mkdir data`

#### 3. Node.js Not Found
If you get "node is not recognized" or similar errors:
- Make sure Node.js is properly installed
- Restart your terminal/command prompt
- Check if Node.js is in your system PATH

#### 4. Database Connection Issues
If you see database-related errors:
- Make sure the `data` directory exists in your project folder
- Check that you have write permissions to the project folder

#### 5. Module Not Found Errors
If you see "module not found" errors:
- Delete the `node_modules` folder
- Delete `package-lock.json` file
- Run `npm install` again

### Checking if Everything is Working

1. **Backend API**: Visit `http://localhost:3001/api/devices` - you should see an empty array `[]`
2. **Frontend**: Visit `http://localhost:3000` (development) or `http://localhost:3001` (production) - you should see the dashboard
3. **Database**: The SQLite database file should be created at `data/database.sqlite`

## Application Features

Once installed and running, you can:

### Dashboard
- View overview of network devices and users
- Monitor system status and statistics

### Devices Management
- Add network devices (Ruijie Gateway, Mikrotik Router, OLT)
- Configure device settings (IP address, credentials, API endpoints)
- Monitor device status

### Users Management
- Create and manage network users
- Support for Hotspot and PPPoE services
- Monitor user sessions and data usage

## Default Login/Access

This application doesn't have authentication by default. You can access all features directly through the web interface.

## Stopping the Application

To stop the development server:
- Press `Ctrl + C` in the terminal where the application is running

## System Requirements

- **RAM**: Minimum 2GB, Recommended 4GB
- **Storage**: At least 500MB free space
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Help

If you encounter issues during installation:

1. Check that all prerequisites are installed correctly
2. Verify you're in the correct project directory
3. Make sure you have internet connection for downloading dependencies
4. Check the terminal output for specific error messages

For additional support, check the error messages in the terminal and ensure all steps were followed correctly.
