import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call';
  description?: string;
  assignedTo?: string;
  assignedToName?: string;
  assigneeType: 'user' | 'marketer';
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('meetings');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState<Omit<Meeting, 'id'>>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'meeting',
    description: '',
    assignedTo: '',
    assignedToName: '',
    assigneeType: 'user'
  });
  
  // Load marketers from localStorage
  const [marketers] = useState(() => {
    const savedMarketers = localStorage.getItem('marketers');
    return savedMarketers ? JSON.parse(savedMarketers) : [];
  });

  // Load users from localStorage (you might want to replace this with an API call)
  const [users] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];
  });

  // Save meetings to localStorage
  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const meeting: Meeting = {
      id: Math.random().toString(36).substr(2, 9),
      ...newMeeting
    };
    setMeetings([...meetings, meeting]);
    setShowAddModal(false);
    setNewMeeting({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'meeting',
      description: '',
      assignedTo: '',
      assignedToName: '',
      assigneeType: 'user'
    });
  };

  const getMeetingsForDate = (date: string) => {
    return meetings.filter(meeting => meeting.date === date);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
    }
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const blanks = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
        <p className="text-gray-400">View and manage your meetings and calls</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedDate(formatDate(new Date()));
                  setShowAddModal(true);
                }}
                className="flex items-center px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
            {[...blanks, ...daysArray].map((day, index) => {
              if (!day) return <div key={`blank-${index}`} className="h-32" />;
              
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateStr = formatDate(date);
              const dayMeetings = getMeetingsForDate(dateStr);

              return (
                <div
                  key={dateStr}
                  className={`
                    min-h-[120px] p-2 border border-gray-700 rounded-lg
                    ${date.toDateString() === new Date().toDateString() ? 'ring-2 ring-purple-500' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    <span className={`
                      ${date.toDateString() === new Date().toDateString() ? 'text-purple-400' : 'text-gray-300'}
                    `}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className={`
                          p-1 rounded text-xs group relative
                          ${meeting.type === 'meeting' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'}
                        `}
                      >
                        <div className="font-medium">{meeting.title}</div>
                        <div>{meeting.startTime} - {meeting.endTime}</div>
                        {meeting.assignedToName && (
                          <div className="text-xs text-gray-400">With: {meeting.assignedToName}</div>
                        )}
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Add Event</h2>
            <form onSubmit={handleAddMeeting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  required
                />
              </div>

              {/* Assignee Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Assign To Type</label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  value={newMeeting.assigneeType}
                  onChange={(e) => {
                    setNewMeeting({
                      ...newMeeting,
                      assigneeType: e.target.value as 'user' | 'marketer',
                      assignedTo: '', // Reset selection when type changes
                      assignedToName: ''
                    });
                  }}
                  required
                >
                  <option value="user">User</option>
                  <option value="marketer">Marketer</option>
                </select>
              </div>
              
              {/* Assign To Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Assign To</label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  value={newMeeting.assignedTo}
                  onChange={(e) => {
                    const list = newMeeting.assigneeType === 'marketer' ? marketers : users;
                    const assignee = list.find(m => m.id === e.target.value);
                    setNewMeeting({
                      ...newMeeting,
                      assignedTo: e.target.value,
                      assignedToName: assignee ? assignee.name : ''
                    });
                  }}
                  required
                >
                  <option value="">Select {newMeeting.assigneeType === 'marketer' ? 'a marketer' : 'a user'}</option>
                  {(newMeeting.assigneeType === 'marketer' ? marketers : users).map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Start Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">End Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Type</label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value as 'meeting' | 'call' })}
                  required
                >
                  <option value="meeting">Meeting</option>
                  <option value="call">Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  className="mt-1 block w-full px-3 py-2 bg-gray-700/50 border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;