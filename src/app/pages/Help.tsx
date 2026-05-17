import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Book, MessageCircle, Mail, FileText } from 'lucide-react';

export const Help: React.FC = () => {
  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Learn how to use SmartLeads with our comprehensive guides',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Connect with other users and share best practices',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our support team via email',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      icon: FileText,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30'
    }
  ];

  const faqs = [
    {
      question: 'How do I add a new lead?',
      answer: 'Navigate to the Leads page and click the "Add Lead" button. Fill in the required information and click "Add Lead" to save.'
    },
    {
      question: 'What\'s the difference between Admin and Sales roles?',
      answer: 'Admins have full access to all leads and can add, edit, and delete them. Sales users can only view leads assigned to them and have read-only access.'
    },
    {
      question: 'How do I export my leads?',
      answer: 'On the Leads page, click the "Export CSV" button to download all your leads as a CSV file.'
    },
    {
      question: 'Can I change the status of a lead?',
      answer: 'Yes! Admins can change lead status from the leads table, lead details page, or edit modal. Sales users can only view status.'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Find answers and get help</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} hover className="cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${resource.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <resource.icon className={`w-6 h-6 ${resource.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@smartleads.com"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
            >
              Email Support
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-center"
            >
              Live Chat
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
