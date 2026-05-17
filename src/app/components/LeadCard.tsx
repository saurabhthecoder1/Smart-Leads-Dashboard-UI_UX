import React from 'react';
import { useNavigate } from 'react-router';
import { Lead, LeadStatus } from '../contexts/LeadsContext';
import { Badge } from './ui/Badge';
import { Eye, Pencil, Trash2, Mail, Building2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case 'qualified': return 'success';
      case 'lost': return 'error';
      case 'contacted': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {lead.company && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-foreground">{lead.company}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-foreground capitalize">{lead.source}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <button
          onClick={() => navigate(`/leads/${lead.id}`)}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        {user?.role === 'admin' && onEdit && (
          <button
            onClick={() => onEdit(lead)}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        )}
        {user?.role === 'admin' && onDelete && (
          <button
            onClick={() => onDelete(lead.id)}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
