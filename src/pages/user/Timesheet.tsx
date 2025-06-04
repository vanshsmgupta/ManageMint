import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Upload, X, Clock, History, Lock, Plus, CalendarDays } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, isSameDay, startOfMonth, endOfMonth, isWithinInterval, setDay, subWeeks, differenceInWeeks, parseISO, isWeekend, isToday, startOfDay, isMonday, isFriday, addDays } from 'date-fns';
import emailjs from '@emailjs/browser';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNotifications } from '../../context/NotificationContext';

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_6qapr5j";  // Hardcoding the working service ID
const EMAILJS_TEMPLATE_ID = "template_gxaszm8"; // Hardcoding the working template ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_2;

// Initialize EmailJS with better error handling
const initializeEmailJS = () => {
  try {
    if (!EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS Public Key is missing. Please check your environment variables.');
      return false;
    }
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

// Initialize EmailJS when the module loads
const isInitialized = initializeEmailJS();

// Project start date - you should store this in your configuration or get it from an API
const PROJECT_START_DATE = '2024-03-01'; // Example date, adjust as needed

type FrequencyType = 'weekly' | 'biweekly' | 'monthly';

interface TimesheetCycle {
  id: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  hours: Record<string, number>;
  screenshots: ScreenshotFile[];
  submitted: boolean;
  isEditable: boolean;
}

interface ScreenshotFile extends File {
  preview?: string;
}

const Timesheet = () => {
  const [isStartDateSet, setIsStartDateSet] = useState(() => {
    const saved = localStorage.getItem('timesheetStartDate');
    return !!saved;
  });
  const [frequency, setFrequency] = useState<FrequencyType>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem('timesheetStartDate');
    return saved ? new Date(saved) : new Date();
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [cycles, setCycles] = useState<TimesheetCycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<TimesheetCycle | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<TimesheetCycle | null>(null);
  const [hours, setHours] = useState<Record<string, number>>({});
  const [screenshots, setScreenshots] = useState<ScreenshotFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousCycles, setPreviousCycles] = useState<TimesheetCycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<TimesheetCycle | null>(null);
  const activeCycleRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

  // Handle initial start date setup
  const handleStartDateSetup = () => {
    if (!selectedDate) return;
    
    localStorage.setItem('timesheetStartDate', selectedDate.toISOString());
    setIsStartDateSet(true);
    generateCycles(selectedDate);
  };

  // Generate cycles based on start date
  const generateCycles = (startDate: Date) => {
    const today = new Date();
    const weeksFromStart = Math.ceil(differenceInWeeks(today, startDate));
    
    let currentStart = new Date(startDate);
    const allCycles: TimesheetCycle[] = [];

    for (let i = 0; i <= weeksFromStart; i++) {
      let cycleEnd: Date;
      
      switch (frequency) {
        case 'weekly':
          cycleEnd = addWeeks(currentStart, 1);
          break;
        case 'biweekly':
          cycleEnd = addWeeks(currentStart, 2);
          break;
        case 'monthly':
          cycleEnd = endOfMonth(currentStart);
          break;
        default:
          cycleEnd = addWeeks(currentStart, 1);
      }

      cycleEnd.setHours(23, 59, 59, 999);

      const cycleId = `cycle-${format(currentStart, 'yyyy-MM-dd')}`;
      allCycles.push({
        id: cycleId,
        startDate: new Date(currentStart),
        endDate: new Date(cycleEnd),
        totalHours: 0,
        hours: {},
        screenshots: [],
        submitted: false,
        isEditable: true
      });

      currentStart = new Date(cycleEnd);
      currentStart.setDate(currentStart.getDate() + 1);
      currentStart.setHours(0, 0, 0, 0);
    }

    // Load and merge saved cycles
    const savedCycles = localStorage.getItem('timesheetCycles');
    if (savedCycles) {
      const parsedCycles = JSON.parse(savedCycles);
      allCycles.forEach((cycle, index) => {
        const savedCycle = parsedCycles.find((saved: TimesheetCycle) => saved.id === cycle.id);
        if (savedCycle) {
          allCycles[index] = {
            ...cycle,
            ...savedCycle,
            startDate: new Date(savedCycle.startDate),
            endDate: new Date(savedCycle.endDate),
            isEditable: !savedCycle.submitted
          };
        }
      });
    }

    // Sort cycles from newest to oldest
    allCycles.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    setCycles(allCycles);
    setPreviousCycles(allCycles);
    
    // Set current cycle
    const currentCycleIndex = allCycles.findIndex(cycle => 
      isWithinInterval(new Date(), { start: cycle.startDate, end: cycle.endDate })
    );
    
    if (currentCycleIndex !== -1) {
      const currentCycle = allCycles[currentCycleIndex];
      setCurrentCycle(currentCycle);
      setActiveCycle(currentCycle);
      setHours(currentCycle.hours);
      setScreenshots(currentCycle.screenshots);
    }
  };

  // Update cycles when frequency changes
  useEffect(() => {
    if (isStartDateSet) {
      generateCycles(selectedDate);
    }
  }, [frequency]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      screenshots.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const isDateInCurrentCycle = (date: Date) => {
    if (!currentCycle) return false;
    
    // Set all dates to noon to avoid timezone issues
    const targetDate = new Date(date);
    targetDate.setHours(12, 0, 0, 0);
    
    const cycleStartDate = new Date(currentCycle.startDate);
    cycleStartDate.setHours(12, 0, 0, 0);
    
    const cycleEndDate = new Date(currentCycle.endDate);
    cycleEndDate.setHours(12, 0, 0, 0);
    
    return targetDate >= cycleStartDate && targetDate <= cycleEndDate;
  };

  const handleHourChange = (date: string, value: number) => {
    if (!activeCycle) return;

    const newHours = {
      ...hours,
      [date]: value
    };
    setHours(newHours);
    saveCycleData(activeCycle.id, newHours, screenshots);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => {
    setCurrentMonth(addWeeks(currentMonth, 4));
  };

  const prevMonth = () => {
    setCurrentMonth(addWeeks(currentMonth, -4));
  };

  const getTotalHours = () => {
    return Object.values(hours).reduce((sum, curr) => sum + (curr || 0), 0);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeCycle) return;

    const files = e.target.files;
    if (files) {
      const newFiles: ScreenshotFile[] = Array.from(files).map(file => {
        const screenshot = file as ScreenshotFile;
        screenshot.preview = URL.createObjectURL(file);
        return screenshot;
      });
      
      const updatedScreenshots = [...screenshots, ...newFiles];
      setScreenshots(updatedScreenshots);
      saveCycleData(activeCycle.id, hours, updatedScreenshots);
    }
    e.target.value = '';
  };

  const removeScreenshot = (index: number) => {
    if (!activeCycle) return;

    setScreenshots(prev => {
      const updatedScreenshots = prev.filter((_, i) => i !== index);
      saveCycleData(activeCycle.id, hours, updatedScreenshots);
      return updatedScreenshots;
    });
  };

  const handleCycleSelect = (cycle: TimesheetCycle) => {
    if (!cycle.isEditable) {
      alert('This cycle has been submitted and cannot be edited.');
      return;
    }

    setActiveCycle(cycle);
    setHours(cycle.hours || {});
    setScreenshots(cycle.screenshots || []);

    // Scroll to the active cycle card with smooth animation
    setTimeout(() => {
      activeCycleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const saveCycleData = (cycleId: string, newHours: Record<string, number>, newScreenshots: ScreenshotFile[]) => {
    const updatedCycles = cycles.map(cycle => {
      if (cycle.id === cycleId) {
        const totalHours = Object.values(newHours).reduce((sum, h) => sum + (h || 0), 0);
        return {
          ...cycle,
          hours: newHours,
          screenshots: newScreenshots,
          totalHours
        };
      }
      return cycle;
    });

    setCycles(updatedCycles);
    setPreviousCycles(updatedCycles);
    localStorage.setItem('timesheetCycles', JSON.stringify(updatedCycles));
  };

  const handleSubmitTimesheet = async () => {
    if (!activeCycle) return;

    if (screenshots.length === 0) {
      alert('Please upload at least one screenshot of your approved timesheet');
      return;
    }

    // Verify EmailJS configuration
    if (!isInitialized) {
      console.error('EmailJS was not properly initialized');
      alert('Email service is not properly configured. Please contact support.');
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS Configuration:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY ? 'Present' : 'Missing'
      });
      alert('Email service is not configured. Please check your environment variables.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Function to compress image
      const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 600;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              // Reduce quality to 0.5 (50%) to further optimize size
              const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
              resolve(dataUrl.split(',')[1]);
            };
            img.onerror = reject;
          };
          reader.onerror = reject;
        });
      };

      // Compress all screenshots (limit to 3)
      const screenshotsToProcess = screenshots.slice(0, 3);
      const compressedImages = await Promise.all(
        screenshotsToProcess.map(screenshot => compressImage(screenshot))
      );

      // Format dates for email
      const cycleStartDate = format(currentCycle?.startDate || new Date(), 'MMMM d, yyyy');
      const cycleEndDate = format(currentCycle?.endDate || new Date(), 'MMMM d, yyyy');
      const totalHours = getTotalHours();

      // Format hours data
      const hoursData = Object.entries(hours)
        .map(([date, hours]) => `${format(new Date(date), 'MMM d')}: ${hours}hrs`)
        .join('\n');

      // Prepare email data with proper formatting
      const templateParams = {
        to_email: 'gvansh2434@gmail.com',
        from_name: 'Timesheet System',
        cycle_period: `${cycleStartDate} - ${cycleEndDate}`,
        total_hours: totalHours.toString(),
        frequency: frequency.charAt(0).toUpperCase() + frequency.slice(1),
        hours_breakdown: hoursData,
        screenshot_1: compressedImages[0] || '',
        screenshot_2: compressedImages[1] || '',
        screenshot_3: compressedImages[2] || '',
        screenshot_count: compressedImages.length.toString(),
        message: `Timesheet submission for cycle: ${cycleStartDate} - ${cycleEndDate}\nTotal Hours: ${totalHours}\nFrequency: ${frequency}\n\nHours Breakdown:\n${hoursData}`
      };

      // Send email using EmailJS with proper configuration
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        // Mark cycle as submitted
        const updatedCycles = cycles.map(cycle => {
          if (cycle.id === activeCycle.id) {
            return {
              ...cycle,
              submitted: true,
              isEditable: false
            };
          }
          return cycle;
        });

        setCycles(updatedCycles);
        setPreviousCycles(updatedCycles);
        localStorage.setItem('timesheetCycles', JSON.stringify(updatedCycles));

        // Clear current selections
        setHours({});
        setScreenshots([]);
        setActiveCycle(null);
        
        alert('Timesheet submitted successfully!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      alert('Error submitting timesheet. Please try again or contact support if the issue persists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for cycle notifications
  useEffect(() => {
    const checkCycleNotifications = () => {
      const today = startOfDay(new Date());
      
      cycles.forEach(cycle => {
        if (!cycle.submitted) {
          const cycleStart = startOfDay(new Date(cycle.startDate));
          const cycleEnd = startOfDay(new Date(cycle.endDate));
          
          // Find the Friday (last working day) of the cycle
          let lastWorkingDay = cycleEnd;
          while (isWeekend(lastWorkingDay) || !isFriday(lastWorkingDay)) {
            lastWorkingDay = addDays(lastWorkingDay, -1);
          }

          // Find the Monday (first working day) of the next cycle
          let nextCycleStart = addDays(cycleEnd, 1);
          while (isWeekend(nextCycleStart) || !isMonday(nextCycleStart)) {
            nextCycleStart = addDays(nextCycleStart, 1);
          }

          // 1. Friday Notification (End of Cycle)
          if (isFriday(today) && isSameDay(today, lastWorkingDay)) {
            const hasUnfilledHours = !cycle.hours || Object.keys(cycle.hours).length === 0;
            
            if (hasUnfilledHours) {
              addNotification({
                title: 'Timesheet Due Today',
                message: `Today is the last working day of your current cycle (${format(cycle.startDate, 'MMM d')} - ${format(cycle.endDate, 'MMM d')}). Please fill and submit your timesheet before the weekend.`,
                type: 'timesheet'
              });
            }
          }

          // 2. Monday Notification (Start of New Cycle)
          if (isMonday(today) && isSameDay(today, nextCycleStart)) {
            // Add new cycle notification
            addNotification({
              title: 'New Timesheet Cycle Started',
              message: `A new timesheet cycle has started today. Remember to log your hours daily.`,
              type: 'timesheet'
            });

            // If previous cycle is incomplete, add a warning notification
            if (!cycle.submitted) {
              addNotification({
                title: 'Previous Timesheet Incomplete',
                message: `Your previous timesheet cycle (${format(cycle.startDate, 'MMM d')} - ${format(cycle.endDate, 'MMM d')}) is still pending submission. Please complete it as soon as possible.`,
                type: 'timesheet'
              });
            }
          }
        }
      });
    };

    // Check immediately and then every 12 hours
    checkCycleNotifications();
    const interval = setInterval(checkCycleNotifications, 12 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [cycles, addNotification]);

  if (!isStartDateSet) {
    return (
      <div className="min-h-screen bg-[#0B0F17] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Timesheet Setup</h1>
          <p className="text-gray-400">Configure your timesheet preferences to get started</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-lg text-white">Initial Configuration</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">First Time Setup</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-4 py-3 bg-[#1C1F26] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as FrequencyType)}
                  className="w-full px-4 py-3 bg-[#1C1F26] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleStartDateSetup}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 flex items-center justify-center gap-2 rounded-lg mt-4"
            >
              <CalendarDays className="w-5 h-5" />
              <span>Start Tracking Time</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#0B0F17]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Timesheet Management</h1>
        <p className="text-gray-400">Manage and track your working hours</p>
      </div>

      {/* Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6 bg-[#1C1F26] rounded-lg shadow-lg border-t-2 border-t-purple-500 border-x-0 border-b-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white/90">Timesheet Settings</h2>
                <div className="text-sm text-white/60">
                  Started {format(selectedDate, 'MMM d, yyyy')}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frequency Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Frequency:</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as FrequencyType)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Current Cycle Display */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Current Cycle:</label>
                  <div className="px-3 py-2 bg-gray-700/50 border border-gray-600 text-white/90 rounded-md">
                    {currentCycle && (
                      <span>
                        {format(currentCycle.startDate, 'MMM d')} - {format(currentCycle.endDate, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6 bg-[#1C1F26] rounded-lg shadow-lg border-t-2 border-t-purple-500 border-x-0 border-b-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/90">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 text-white/40 hover:text-white/60 hover:bg-gray-700/50 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 text-white/40 hover:text-white/60 hover:bg-gray-700/50 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-white/40 py-2">
                    {day}
                  </div>
                ))}
                {daysInMonth.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const cycle = cycles.find(c => 
                    isWithinInterval(date, { start: c.startDate, end: c.endDate })
                  );
                  const isInCycle = !!cycle;
                  const isEditable = cycle?.isEditable;
                  
                  return (
                    <div
                      key={dateStr}
                      className={`
                        p-2 border rounded-lg transition-colors
                        ${isInCycle 
                          ? isEditable
                            ? 'bg-purple-600/20 border-purple-500/20'
                            : 'bg-gray-800/50 border-gray-700/50'
                          : 'bg-gray-800/30 border-gray-700/30'
                        }
                      `}
                    >
                      <div className="text-sm font-medium text-white/60 mb-1">
                        {format(date, 'd')}
                      </div>
                      {isInCycle && isEditable && (
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={hours[dateStr] || ''}
                          onChange={(e) => handleHourChange(dateStr, Number(e.target.value))}
                          className="w-full px-2 py-1 text-sm bg-gray-700/50 border-gray-600 text-white rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="0"
                        />
                      )}
                      {isInCycle && !isEditable && hours[dateStr] && (
                        <div className="text-sm text-white/40 text-center">
                          {hours[dateStr]} hrs
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Cycle Card */}
          <div 
            ref={activeCycleRef}
            className="mb-6 bg-[#1C1F26] rounded-lg shadow-lg border-t-2 border-t-purple-500 border-x-0 border-b-0"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white/90">
                    {activeCycle ? 'Selected Cycle' : 'Current Cycle'}
                  </h2>
                  {activeCycle && (
                    <p className="text-white/60 mt-1">
                      {format(activeCycle.startDate, 'MMM d')} - {format(activeCycle.endDate, 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Total Hours</p>
                  <p className="text-2xl font-semibold text-white">
                    {Object.values(hours).reduce((sum, h) => sum + (h || 0), 0)}
                  </p>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-white/40 py-2">
                    {day}
                  </div>
                ))}
                {activeCycle && eachDayOfInterval({ 
                  start: activeCycle.startDate, 
                  end: activeCycle.endDate 
                }).map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return (
                    <div
                      key={dateStr}
                      className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="text-sm font-medium text-white/60 mb-2">
                        {format(date, 'd')}
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={hours[dateStr] || ''}
                        onChange={(e) => handleHourChange(dateStr, Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm bg-gray-700/50 border-gray-600 text-white rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="0"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Screenshot Upload Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Upload Timesheet Screenshots</h4>
                      <p className="text-xs text-white/60">Please upload screenshots for this cycle</p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        multiple
                      />
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 text-white/60 hover:bg-gray-700 rounded-lg transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Add Screenshots</span>
                      </div>
                    </label>
                  </div>

                  {/* Screenshot Preview Grid */}
                  {screenshots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {screenshots.map((file, index) => (
                        <div
                          key={index}
                          className="group relative aspect-video bg-gray-700/30 rounded-lg border border-gray-600 overflow-hidden"
                        >
                          {file.preview && (
                            <>
                              <img
                                src={file.preview}
                                alt={`Screenshot ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => removeScreenshot(index)}
                                className="absolute top-2 right-2 p-1 bg-gray-900/80 text-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Cycles List */}
        <div className="lg:col-span-1">
          <div className="bg-[#1C1F26] rounded-lg border-t-2 border-t-purple-500">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <h2 className="text-lg font-semibold text-white/90">Timesheet Cycles</h2>
                </div>
                <span className="text-sm text-white/60">{cycles.length} cycles</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {cycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    onClick={() => handleCycleSelect(cycle)}
                    className={`
                      relative cursor-pointer rounded-lg transition-all duration-200
                      ${activeCycle?.id === cycle.id
                        ? 'bg-purple-500/10 border border-purple-500/20'
                        : 'bg-[#262B36] border border-gray-800 hover:bg-[#2A2F3B] hover:border-purple-500/20'
                      }
                    `}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            cycle.submitted 
                              ? 'bg-gray-600' 
                              : activeCycle?.id === cycle.id
                              ? 'bg-purple-500'
                              : 'bg-gray-700'
                          }`} />
                          <span className="text-base font-medium text-white/90">
                            {format(cycle.startDate, 'MMM d')} - {format(cycle.endDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className={`text-base font-medium ${
                          cycle.totalHours > 0
                            ? 'text-purple-400'
                            : 'text-white/40'
                        }`}>
                          {cycle.totalHours} hrs
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {cycle.screenshots.length > 0 && (
                            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-800/50">
                              <Upload className="w-4 h-4 text-white/60" />
                              <span className="text-sm text-white/60">{cycle.screenshots.length}</span>
                            </div>
                          )}
                        </div>
                        {cycle.submitted ? (
                          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-800/50">
                            <Lock className="w-4 h-4 text-white/60" />
                            <span className="text-sm text-white/60">Submitted</span>
                          </div>
                        ) : (
                          <button 
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Fill Hours</span>
                          </button>
                        )}
                      </div>

                      {!cycle.isEditable && (
                        <div className="absolute inset-0 bg-[#1C1F26]/90 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50">
                            <Lock className="w-5 h-5 text-white/60" />
                            <span className="text-sm font-medium text-white/60">Locked</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {activeCycle && (
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            className="px-4 py-2 border border-gray-600 text-white/60 hover:bg-gray-700/50 rounded-lg transition-colors"
            onClick={() => {
              setHours({});
              setScreenshots([]);
              setActiveCycle(null);
            }}
          >
            Clear
          </button>
          <button 
            className={`px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors flex items-center space-x-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleSubmitTimesheet}
            disabled={isSubmitting}
          >
            <span>Submit Cycle</span>
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Timesheet;