import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

interface ScheduleCall {
  id: string;
  title: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const ScheduleCalls: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for calls
  const mockCalls: ScheduleCall[] = [
    {
      id: '1',
      title: 'Project Requirements',
      clientName: 'ABC Corporation',
      date: '2025-05-21',
      time: '09:00',
      duration: 60,
      status: 'scheduled',
      notes: 'Discuss web application requirements and timeline',
    },
    {
      id: '2',
      title: 'Follow-up Discussion',
      clientName: 'XYZ Inc',
      date: '2025-05-22',
      time: '14:30',
      duration: 45,
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Project Demo',
      clientName: 'Acme Ltd',
      date: '2025-05-20',
      time: '11:00',
      duration: 30,
      status: 'completed',
      notes: 'Demonstrated the initial prototype',
    },
    {
      id: '4',
      title: 'Contract Negotiation',
      clientName: 'Global Services',
      date: '2025-05-19',
      time: '15:00',
      duration: 90,
      status: 'cancelled',
      notes: 'Rescheduled for next week',
    },
  ];

  // Filter calls based on search query
  const filteredCalls = mockCalls.filter(call => 
    call.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group calls by date
  const groupedCalls: Record<string, ScheduleCall[]> = {};
  
  filteredCalls.forEach(call => {
    if (!groupedCalls[call.date]) {
      groupedCalls[call.date] = [];
    }
    groupedCalls[call.date].push(call);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedCalls).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Calls</h1>
          <p className="text-gray-500">Manage and organize your client calls</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add New Call
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Upcoming Calls</CardTitle>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedDates.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    {formatDate(date)}
                  </h3>
                  <div className="space-y-3">
                    {groupedCalls[date].map(call => (
                      <div 
                        key={call.id}
                        className={`
                          p-4 border rounded-lg
                          ${call.status === 'completed' ? 'bg-gray-50 border-gray-200' :
                            call.status === 'cancelled' ? 'bg-red-50 border-red-100' :
                            'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all'}
                        `}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{call.title}</h4>
                              <Badge
                                variant={
                                  call.status === 'completed' ? 'success' :
                                  call.status === 'cancelled' ? 'danger' : 'primary'
                                }
                              >
                                {call.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{call.clientName}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{call.time}</p>
                              <p className="text-xs text-gray-500">{call.duration} minutes</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                        {call.notes && (
                          <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                            {call.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No calls found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Schedule New Call</h2>
            <form className="space-y-4">
              <Input label="Title" type="text" required />
              <Input label="Client Name" type="text" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" required />
                <Input label="Time" type="time" required />
              </div>
              <Input label="Duration (minutes)" type="number" min="15" step="15" defaultValue="30" required />
              <Input label="Notes" as="textarea" rows={3} />
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button>
                  Schedule Call
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalls;