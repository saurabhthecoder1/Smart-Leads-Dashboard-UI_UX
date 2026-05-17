import React from 'react';
import { Link, useLocation } from 'react-router';
import { BarChart3, LayoutDashboard, Users, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/Badge';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge, active }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
        ${active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }
      `}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      {badge && <Badge variant="success">{badge}</Badge>}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/leads', icon: <Users className="w-5 h-5" />, label: 'Leads' },
    { to: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { to: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support' },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-sidebar-foreground">SmartLeads</div>
            <div className="text-xs text-muted-foreground">CRM Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            active={location.pathname === item.to}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-sidebar-foreground truncate">{user?.name}</div>
            <div className="flex items-center gap-2">
              <Badge variant={user?.role === 'admin' ? 'info' : 'default'}>
                {user?.role === 'admin' ? 'Admin' : 'Sales'}
              </Badge>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};
