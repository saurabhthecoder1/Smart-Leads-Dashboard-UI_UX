import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { User, Shield, Bell, Palette } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <CardTitle>Account Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="mt-1 text-foreground">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1 text-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1">
                  <Badge variant={user?.role === 'admin' ? 'info' : 'default'}>
                    {user?.role === 'admin' ? 'Administrator' : 'Sales User'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <CardTitle>Role Permissions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.role === 'admin' ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-sm text-foreground">View all leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-sm text-foreground">Add and edit leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-sm text-foreground">Delete leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-sm text-foreground">Access analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-sm text-foreground">Manage users</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-sm text-foreground">View assigned leads only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-sm text-foreground">View personal analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <span className="text-sm text-muted-foreground">Cannot add/edit/delete leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <span className="text-sm text-muted-foreground">Limited analytics access</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-foreground">Email notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-indigo-600" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-foreground">New lead alerts</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-indigo-600" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-foreground">Status change updates</span>
                <input type="checkbox" className="w-4 h-4 rounded border-border text-indigo-600" />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Theme preference is controlled via the toggle in the top navigation bar.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <span className="text-sm text-foreground">Supports light and dark mode</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <span className="text-sm text-foreground">Persistent theme selection</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
