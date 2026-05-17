import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral' | 'linkedin' | 'email';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  assignedTo?: string;
  notes?: string;
  phone?: string;
  company?: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  type: 'note' | 'email' | 'call' | 'meeting' | 'status_change';
  content: string;
  timestamp: string;
  user: string;
}

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'activities'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  addActivity: (leadId: string, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

// Mock data generator
const generateMockLeads = (): Lead[] => {
  const names = ['Emma Wilson', 'James Chen', 'Sarah Parker', 'Michael Brown', 'Lisa Anderson', 'David Martinez', 'Jennifer Lee', 'Robert Taylor', 'Emily Davis', 'Christopher Garcia', 'Amanda Rodriguez', 'Daniel Kim', 'Jessica Thompson', 'Matthew White', 'Ashley Harris'];
  const companies = ['TechCorp', 'InnovateLabs', 'DataDrive Inc', 'CloudSolutions', 'StartupX', 'GrowthHub', 'ScaleTech', 'NextGen Systems', 'FutureWorks', 'Visionary Ltd'];
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'lost'];
  const sources: LeadSource[] = ['website', 'instagram', 'referral', 'linkedin', 'email'];

  return Array.from({ length: 45 }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: companies[Math.floor(Math.random() * companies.length)],
    phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    assignedTo: i % 3 === 0 ? '1' : '2',
    activities: [
      {
        id: `activity-${i}-1`,
        type: 'note',
        content: 'Initial contact made via email',
        timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User'
      }
    ]
  }));
};

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      const mockLeads = generateMockLeads();
      setLeads(mockLeads);
      localStorage.setItem('leads', JSON.stringify(mockLeads));
    }
  }, []);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'activities'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      activities: [{
        id: `activity-${Date.now()}`,
        type: 'note',
        content: 'Lead created',
        timestamp: new Date().toISOString(),
        user: user?.name || 'System'
      }]
    };
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === id) {
        const statusChanged = updates.status && updates.status !== lead.status;
        const updatedLead = { ...lead, ...updates };

        if (statusChanged) {
          const activity: Activity = {
            id: `activity-${Date.now()}`,
            type: 'status_change',
            content: `Status changed from ${lead.status} to ${updates.status}`,
            timestamp: new Date().toISOString(),
            user: user?.name || 'System'
          };
          updatedLead.activities = [...(lead.activities || []), activity];
        }

        return updatedLead;
      }
      return lead;
    });
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const deleteLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const getLeadById = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  const addActivity = (leadId: string, activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        const activity: Activity = {
          ...activityData,
          id: `activity-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        return {
          ...lead,
          activities: [...(lead.activities || []), activity]
        };
      }
      return lead;
    });
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById, addActivity }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
