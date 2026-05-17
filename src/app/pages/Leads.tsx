import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useLeads, Lead, LeadStatus, LeadSource } from '../contexts/LeadsContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { LeadCard } from '../components/LeadCard';
import { Search, Plus, Download, Filter, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { AddEditLeadModal } from '../components/modals/AddEditLeadModal';
import { toast } from 'sonner';

export const Leads: React.FC = () => {
  const { leads, deleteLead } = useLeads();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const itemsPerPage = 10;

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Role-based filtering
    if (user?.role === 'sales') {
      result = result.filter(lead => lead.assignedTo === user.id);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      result = result.filter(lead => lead.source === sourceFilter);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [leads, user, searchQuery, statusFilter, sourceFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      toast.success('Lead deleted successfully');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Source', 'Company', 'Created At'];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.company || '',
      format(new Date(lead.createdAt), 'yyyy-MM-dd')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Leads exported successfully');
  };

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case 'qualified': return 'success';
      case 'lost': return 'error';
      case 'contacted': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          {user?.role === 'admin' && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as LeadSource | 'all')}
              className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
              className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} leads
            </span>
          </div>
        </div>
      </Card>

      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-4">
        {paginatedLeads.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">No leads found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            </div>
          </Card>
        ) : (
          paginatedLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={user?.role === 'admin' ? setEditingLead : undefined}
              onDelete={user?.role === 'admin' ? handleDelete : undefined}
            />
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <Card className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">No leads found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-foreground">{lead.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{lead.company || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground capitalize">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="p-2 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <>
                            <button
                              onClick={() => setEditingLead(lead)}
                              className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                              title="Edit lead"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                              title="Delete lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Desktop */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Pagination - Mobile */}
      {totalPages > 1 && (
        <div className="lg:hidden flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-foreground">{currentPage}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEditLeadModal
        isOpen={isAddModalOpen || editingLead !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
      />
    </div>
  );
};
