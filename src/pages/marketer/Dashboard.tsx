import React, { useState, useEffect } from 'react';
import { Home, Users, FileText, Send, CheckSquare, DollarSign, Plus, Settings, X, GripHorizontal } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Modal from '../../components/Modal';
import { DynamicChart } from '../../components/charts/DashboardCharts';

interface Widget {
  id: string;
  type: 'stats' | 'submissions' | 'assessments' | 'consultants' | 'offers' | 'totalOffers';
  title: string;
  visible: boolean;
  position: number;
  chartType?: 'line' | 'bar' | 'area' | 'pie';
}

interface DashboardPreferences {
  widgets: Widget[];
  dateRange: {
    start: string;
    end: string;
  };
}

const defaultWidgets: Widget[] = [
  { id: 'stats', type: 'stats', title: 'Statistics', visible: true, position: 0 },
  { id: 'submissions', type: 'submissions', title: 'Submissions Chart', visible: true, position: 1, chartType: 'line' },
  { id: 'assessments', type: 'assessments', title: 'Assessments Chart', visible: true, position: 2, chartType: 'bar' },
  { id: 'consultants', type: 'consultants', title: 'Active Consultants', visible: true, position: 3 },
  { id: 'offers', type: 'offers', title: 'Recent Offers', visible: true, position: 4 },
  { id: 'totalOffers', type: 'totalOffers', title: 'Total Offers by Month', visible: true, position: 5, chartType: 'bar' }
];

const CHART_WIDGETS = ['submissions', 'assessments', 'totalOffers'];

const Dashboard = () => {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem('marketerDashboardPreferences');
    return saved ? JSON.parse(saved) : {
      widgets: defaultWidgets,
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      }
    };
  });

  const [stats, setStats] = useState([
    {
      title: 'Active Consultants',
      value: '0',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Submissions',
      value: '0',
      icon: <Send className="w-6 h-6 text-green-400" />,
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Assessments',
      value: '0',
      icon: <CheckSquare className="w-6 h-6 text-purple-400" />,
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Active Offers',
      value: '0',
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      change: '0%',
      changeType: 'neutral'
    }
  ]);

  // Sample data for charts
  const submissionsData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 3 },
    { name: 'Mar', value: 5 },
    { name: 'Apr', value: 7 },
    { name: 'May', value: 2 },
    { name: 'Jun', value: 6 }
  ];

  const assessmentsData = [
    { name: 'Jan', value: 2 },
    { name: 'Feb', value: 4 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 5 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 3 }
  ];

  // Sample data for consultants and offers
  const recentConsultants = [
    { id: '1', name: 'John Doe', status: 'Active', technology: 'React' },
    { id: '2', name: 'Jane Smith', status: 'Interview', technology: 'Node.js' },
    { id: '3', name: 'Mike Johnson', status: 'Active', technology: 'Python' }
  ];

  const recentOffers = [
    { id: '1', consultant: 'John Doe', client: 'Tech Corp', status: 'Pending' },
    { id: '2', consultant: 'Jane Smith', client: 'Dev Inc', status: 'Accepted' },
    { id: '3', consultant: 'Mike Johnson', client: 'Software Co', status: 'Review' }
  ];

  // Sample data for total offers by month
  const totalOffersData = [
    { name: 'Jan', value: 8 },
    { name: 'Feb', value: 12 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 10 },
    { name: 'May', value: 18 },
    { name: 'Jun', value: 14 }
  ];

  useEffect(() => {
    localStorage.setItem('marketerDashboardPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    // Load data from localStorage
    const loadStats = () => {
      const consultants = JSON.parse(localStorage.getItem('consultants') || '[]');
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      const offers = JSON.parse(localStorage.getItem('offers') || '[]');

      // Calculate changes from previous month
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

      const activeConsultants = consultants.filter((c: any) => c.status === 'active').length;
      const activeSubmissions = submissions.filter((s: any) => s.status === 'active').length;
      const activeAssessments = assessments.filter((a: any) => a.status === 'active').length;
      const activeOffers = offers.filter((o: any) => o.status === 'active').length;

      const lastMonthSubmissions = submissions.filter((s: any) => {
        const date = new Date(s.createdAt);
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
      }).length;

      const lastMonthAssessments = assessments.filter((a: any) => {
        const date = new Date(a.createdAt);
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
      }).length;

      const lastMonthOffers = offers.filter((o: any) => {
        const date = new Date(o.createdAt);
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
      }).length;

      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return { value: '0', type: 'neutral' };
        const change = ((current - previous) / previous) * 100;
        return {
          value: `${Math.abs(change).toFixed(0)}%`,
          type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
        };
      };

      setStats([
        {
          title: 'Active Consultants',
          value: activeConsultants.toString(),
          icon: <Users className="w-6 h-6 text-blue-400" />,
          change: '0%',
          changeType: 'neutral'
        },
        {
          title: 'Submissions',
          value: activeSubmissions.toString(),
          icon: <Send className="w-6 h-6 text-green-400" />,
          ...calculateChange(activeSubmissions, lastMonthSubmissions)
        },
        {
          title: 'Assessments',
          value: activeAssessments.toString(),
          icon: <CheckSquare className="w-6 h-6 text-purple-400" />,
          ...calculateChange(activeAssessments, lastMonthAssessments)
        },
        {
          title: 'Active Offers',
          value: activeOffers.toString(),
          icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
          ...calculateChange(activeOffers, lastMonthOffers)
        }
      ]);
    };

    loadStats();
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const visibleWidgets = preferences.widgets
      .filter(widget => widget.visible)
      .sort((a, b) => a.position - b.position);

    const draggedWidget = visibleWidgets[sourceIndex];
    const newPosition = destinationIndex;

    // Update positions for all widgets
    const updatedWidgets = preferences.widgets.map(widget => {
      if (!widget.visible) return widget;
      if (widget.id === draggedWidget.id) {
        return { ...widget, position: newPosition };
      }
      if (sourceIndex < destinationIndex) {
        if (widget.position <= destinationIndex && widget.position > sourceIndex) {
          return { ...widget, position: widget.position - 1 };
        }
      } else {
        if (widget.position >= destinationIndex && widget.position < sourceIndex) {
          return { ...widget, position: widget.position + 1 };
        }
      }
      return widget;
    });

    setPreferences({
      ...preferences,
      widgets: updatedWidgets
    });
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setPreferences({
      ...preferences,
      widgets: preferences.widgets.map(widget => 
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
      )
    });
  };

  const handleChartTypeChange = (widgetId: string, chartType: 'line' | 'bar' | 'area' | 'pie') => {
    setPreferences({
      ...preferences,
      widgets: preferences.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, chartType } : widget
      )
    });
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    {stat.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-400'
                        : stat.changeType === 'negative'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{stat.value}</h2>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            ))}
          </div>
        );
      
      case 'submissions':
        return (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="h-64">
              <DynamicChart
                data={submissionsData}
                color="#10B981"
                title="Submissions"
                chartType={widget.chartType || 'line'}
                onChangeChartType={(type) => handleChartTypeChange(widget.id, type)}
              />
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="h-64">
              <DynamicChart
                data={assessmentsData}
                color="#8B5CF6"
                title="Assessments"
                chartType={widget.chartType || 'bar'}
                onChangeChartType={(type) => handleChartTypeChange(widget.id, type)}
              />
            </div>
          </div>
        );

      case 'totalOffers':
        return (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="h-64">
              <DynamicChart
                data={totalOffersData}
                color="#F59E0B"
                title="Total Offers"
                chartType={widget.chartType || 'bar'}
                onChangeChartType={(type) => handleChartTypeChange(widget.id, type)}
              />
            </div>
          </div>
        );

      case 'consultants':
        return (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="space-y-4">
              {recentConsultants.map(consultant => (
                <div
                  key={consultant.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <h4 className="text-white font-medium">{consultant.name}</h4>
                    <p className="text-gray-400 text-sm">{consultant.technology}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      consultant.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {consultant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="space-y-4">
              {recentOffers.map(offer => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <h4 className="text-white font-medium">{offer.consultant}</h4>
                    <p className="text-gray-400 text-sm">{offer.client}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      offer.status === 'Accepted'
                        ? 'bg-green-500/20 text-green-400'
                        : offer.status === 'Pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDraggableWidget = (widget: Widget, index: number) => (
    <Draggable key={widget.id} draggableId={widget.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
        >
          <div className="group">
            <div
              {...provided.dragHandleProps}
              className="absolute -left-4 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move"
            >
              <GripHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            {renderWidget(widget)}
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderCustomizeModalContent = () => (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Customize your dashboard by reordering widgets and changing chart types.
      </p>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modal-widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {preferences.widgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <Draggable key={widget.id} draggableId={`modal-${widget.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <GripHorizontal className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{widget.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {CHART_WIDGETS.includes(widget.type) && (
                            <select
                              value={widget.chartType || 'bar'}
                              onChange={(e) => handleChartTypeChange(widget.id, e.target.value as any)}
                              className="px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-sm text-white cursor-pointer hover:bg-gray-600/50 transition-colors"
                            >
                              <option value="line">📈 Line Chart</option>
                              <option value="bar">📊 Bar Chart</option>
                              <option value="area">🌊 Area Chart</option>
                              <option value="pie">🥧 Pie Chart</option>
                            </select>
                          )}
                          <button
                            onClick={() => toggleWidgetVisibility(widget.id)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              widget.visible
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-gray-700/50 text-gray-400'
                            }`}
                          >
                            {widget.visible ? 'Visible' : 'Hidden'}
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your marketer dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={preferences.dateRange.start}
              onChange={(e) => setPreferences({
                ...preferences,
                dateRange: { ...preferences.dateRange, start: e.target.value }
              })}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={preferences.dateRange.end}
              onChange={(e) => setPreferences({
                ...preferences,
                dateRange: { ...preferences.dateRange, end: e.target.value }
              })}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm"
            />
          </div>
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Customize
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-6 min-h-[200px] ${
                snapshot.isDraggingOver ? 'bg-gray-800/20 rounded-lg' : ''
              }`}
            >
              {preferences.widgets
                .filter(widget => widget.visible)
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => renderDraggableWidget(widget, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        title="Customize Dashboard"
      >
        {renderCustomizeModalContent()}
      </Modal>
    </div>
  );
};

export default Dashboard;