import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLeads } from '../contexts/LeadsContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Mail, Phone, Building2, Calendar, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { AddEditLeadModal } from '../components/modals/AddEditLeadModal';
import { toast } from 'sonner';

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getLeadById, addActivity, updateLead, deleteLead } = useLeads();
  const { user } = useAuth();
  const navigate = useNavigate();

  const lead = id ? getLeadById(id) : null;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!lead) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Lead not found</h2>
            <p className="text-muted-foreground mb-6">The lead you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/leads')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    try {
      addActivity(lead.id, {
        type: 'note',
        content: newNote,
        user: user?.name || 'System'
      });
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleStatusChange = (newStatus: typeof lead.status) => {
    updateLead(lead.id, { status: newStatus });
    toast.success('Status updated successfully');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(lead.id);
      toast.success('Lead deleted successfully');
      navigate('/leads');
    }
  };

  const getStatusBadgeVariant = (status: typeof lead.status) => {
    switch (status) {
      case 'qualified': return 'success';
      case 'lost': return 'error';
      case 'contacted': return 'info';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/leads')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{lead.name}</h1>
            <p className="text-muted-foreground mt-1">{lead.email}</p>
          </div>
        </div>
        {user?.role === 'admin' && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-foreground">{lead.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">{lead.email}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  {user?.role === 'admin' ? (
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(e.target.value as typeof lead.status)}
                      className="w-full mt-1 px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Source</label>
                  <p className="mt-1 text-foreground capitalize">{lead.source}</p>
                </div>

                {lead.company && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company
                    </label>
                    <p className="mt-1 text-foreground">{lead.company}</p>
                  </div>
                )}

                {lead.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <p className="mt-1 text-foreground">{lead.phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created
                  </label>
                  <p className="mt-1 text-foreground">
                    {format(new Date(lead.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {lead.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{lead.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note */}
          <Card>
            <CardHeader>
              <CardTitle>Add Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Add a note or comment..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                />
                <Button onClick={handleAddNote} isLoading={isAddingNote}>
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!lead.activities || lead.activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No activities yet</p>
                    <p className="text-sm mt-1">Add your first note above</p>
                  </div>
                ) : (
                  [...lead.activities].reverse().map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950/30 rounded-full flex items-center justify-center text-indigo-600">
                          {getActivityIcon(activity.type)}
                        </div>
                        {index < lead.activities!.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-2" />
                        )}
                      </div>

                      {/* Activity content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-medium text-foreground">{activity.user}</span>
                              <Badge variant="default" className="ml-2 capitalize">
                                {activity.type}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(activity.timestamp), 'MMM dd, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{activity.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <AddEditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={lead}
      />
    </div>
  );
};
