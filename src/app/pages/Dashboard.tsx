import React, { useMemo } from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users, UserCheck, UserX, TrendingUp, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { leads } = useLeads();
  const { user } = useAuth();

  // Filter leads based on role
  const visibleLeads = useMemo(() => {
    if (user?.role === 'admin') {
      return leads;
    }
    return leads.filter(lead => lead.assignedTo === user?.id);
  }, [leads, user]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = visibleLeads.length;
    const qualified = visibleLeads.filter(l => l.status === 'qualified').length;
    const lost = visibleLeads.filter(l => l.status === 'lost').length;
    const conversionRate = total > 0 ? ((qualified / total) * 100).toFixed(1) : '0';

    return { total, qualified, lost, conversionRate };
  }, [visibleLeads]);

  // Chart data - Leads over time
  const leadsOverTime = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = visibleLeads.filter(lead =>
        format(new Date(lead.createdAt), 'yyyy-MM-dd') === dateStr
      ).length;
      return {
        date: format(date, 'MMM dd'),
        leads: count
      };
    });
    return last7Days;
  }, [visibleLeads]);

  // Status distribution
  const statusData = useMemo(() => {
    const statusCounts = {
      new: visibleLeads.filter(l => l.status === 'new').length,
      contacted: visibleLeads.filter(l => l.status === 'contacted').length,
      qualified: visibleLeads.filter(l => l.status === 'qualified').length,
      lost: visibleLeads.filter(l => l.status === 'lost').length,
    };

    return [
      { name: 'New', value: statusCounts.new, color: '#6366f1' },
      { name: 'Contacted', value: statusCounts.contacted, color: '#8b5cf6' },
      { name: 'Qualified', value: statusCounts.qualified, color: '#10b981' },
      { name: 'Lost', value: statusCounts.lost, color: '#ef4444' },
    ];
  }, [visibleLeads]);

  // Source distribution
  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    visibleLeads.forEach(lead => {
      sources[lead.source] = (sources[lead.source] || 0) + 1;
    });

    return Object.entries(sources).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [visibleLeads]);

  // Recent activities
  const recentActivities = useMemo(() => {
    const activities: Array<{ lead: string; activity: string; time: string; status: string }> = [];

    visibleLeads.slice(0, 5).forEach(lead => {
      if (lead.activities && lead.activities.length > 0) {
        const latestActivity = lead.activities[lead.activities.length - 1];
        activities.push({
          lead: lead.name,
          activity: latestActivity.content,
          time: format(new Date(latestActivity.timestamp), 'MMM dd, h:mm a'),
          status: lead.status
        });
      }
    });

    return activities;
  }, [visibleLeads]);

  const statCards = [
    {
      title: 'Total Leads',
      value: metrics.total,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      title: 'Qualified Leads',
      value: metrics.qualified,
      change: '+8%',
      trend: 'up',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      title: 'Lost Leads',
      value: metrics.lost,
      change: '-3%',
      trend: 'down',
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/30'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}! Here's what's happening with your leads.
        </p>
        {user?.role === 'sales' && (
          <Badge variant="info" className="mt-2">Viewing your assigned leads only</Badge>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Time (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activities
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.lead}</p>
                      <p className="text-sm text-muted-foreground">{activity.activity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                    <Badge variant={
                      activity.status === 'qualified' ? 'success' :
                      activity.status === 'lost' ? 'error' :
                      activity.status === 'contacted' ? 'info' : 'default'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
