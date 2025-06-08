import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Network, Users, Router, BarChart3 } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Network className="h-6 w-6" />
              <span className="text-lg font-semibold">Network Manager</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              
              <Button
                variant={isActive('/devices') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/devices" className="flex items-center space-x-2">
                  <Router className="h-4 w-4" />
                  <span>Devices</span>
                </Link>
              </Button>
              
              <Button
                variant={isActive('/users') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to="/users" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
