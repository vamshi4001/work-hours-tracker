'use client';

import { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend, parseISO, getDay, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { hoursDB } from '../lib/indexedDB';

type WeekData = {
  [key: string]: string;
};

export default function HoursTracker() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('monthly');
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [monthData, setMonthData] = useState<{ [key: string]: string }>({});

  // Load data from IndexedDB
  useEffect(() => {
    const loadMonthData = async () => {
      const dateToUse = viewMode === 'weekly' ? currentWeek : currentMonth;
      const monthKey = format(dateToUse, 'yyyy-MM');
      try {
        const savedData = await hoursDB.getMonthData(monthKey);
        if (savedData) {
          setMonthData(savedData);
        } else {
          setMonthData({});
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setMonthData({});
      }
    };
    loadMonthData();
  }, [currentMonth, currentWeek, viewMode]);

  // Initialize weeks data
  useEffect(() => {
    let weeksData: WeekData[] = [];
    
    if (viewMode === 'weekly') {
      // Weekly view - show just current week
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const week: WeekData = {};
      weekDays.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        week[dayKey] = monthData[dayKey] || '';
      });
      
      weeksData = [week];
    } else {
      // Monthly view - existing logic
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      
      // Get the first Monday of the calendar (might be from previous month)
      const firstDay = new Date(startDate);
      const dayOfWeek = getDay(firstDay);
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
      firstDay.setDate(firstDay.getDate() - daysToSubtract);
      
      // Get the last Sunday of the calendar (might be from next month)
      const lastDay = new Date(endDate);
      const lastDayOfWeek = getDay(lastDay);
      const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      lastDay.setDate(lastDay.getDate() + daysToAdd);
      
      const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });
      
      // Group days by week (Monday to Sunday)
      for (let i = 0; i < allDays.length; i += 7) {
        const weekDays = allDays.slice(i, i + 7);
        const week: WeekData = {};
        
        weekDays.forEach(day => {
          const dayKey = format(day, 'yyyy-MM-dd');
          week[dayKey] = monthData[dayKey] || '';
        });
        
        weeksData.push(week);
      }
    }
    
    setWeeks(weeksData);
    calculateMonthTotal(weeksData);
  }, [currentMonth, currentWeek, monthData, viewMode]);

  const calculateWeekTotal = (week: WeekData) => {
    return Object.values(week).reduce((sum, hours) => {
      return sum + (parseFloat(hours) || 0);
    }, 0);
  };

  const calculateMonthTotal = (weeksData: WeekData[]) => {
    const total = weeksData.reduce((sum, week) => {
      return sum + calculateWeekTotal(week);
    }, 0);
    setMonthTotal(total);
  };

  const saveData = async (newData: { [key: string]: string }) => {
    const dateToUse = viewMode === 'weekly' ? currentWeek : currentMonth;
    const monthKey = format(dateToUse, 'yyyy-MM');
    try {
      await hoursDB.saveMonthData(monthKey, newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = async (day: string, value: string) => {
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const newMonthData = { ...monthData, [day]: value };
      setMonthData(newMonthData);
      await saveData(newMonthData);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'weekly') {
      setCurrentWeek(addWeeks(currentWeek, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const prevPeriod = () => {
    if (viewMode === 'weekly') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const getDisplayTitle = () => {
    if (viewMode === 'weekly') {
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentMonth, 'MMMM yyyy');
    }
  };

  const renderDayHeader = (day: string) => {
    const date = parseISO(day);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    
    return (
      <th key={day} style={{
        padding: '12px',
        textAlign: 'center',
        border: '1px solid #d1d5db',
        backgroundColor: '#f9fafb',
        fontWeight: '500',
        fontSize: '14px',
        color: !isCurrentMonth ? '#9ca3af' : '#374151'
      }}>
        <div style={{ fontWeight: '600' }}>{format(date, 'EEE')}</div>
        <div style={{ fontSize: '12px' }}>{format(date, 'MM/dd')}</div>
      </th>
    );
  };

  const renderCell = (week: WeekData, weekIndex: number, day: string) => {
    const date = parseISO(day);
    const isWeekendDay = isWeekend(date);
    const referenceDate = viewMode === 'weekly' ? currentWeek : currentMonth;
    const isCurrentPeriod = viewMode === 'weekly' ? true : isSameMonth(date, currentMonth);
    const isEditable = !isWeekendDay && isCurrentPeriod;
    const value = week[day] || '';
    const dayNumber = format(date, 'd');

    // Simple input for editable weekday cells
    if (isEditable) {
      return (
        <td key={day} style={{
          padding: '4px',
          border: '1px solid #d1d5db',
          backgroundColor: '#ffffff',
          minWidth: '80px',
          height: '60px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '2px',
            left: '4px',
            fontSize: '10px',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {dayNumber}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(day, e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              textAlign: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e40af',
              paddingTop: '12px'
            }}
            placeholder="0"
          />
        </td>
      );
    }

    // Non-editable cells (weekends, other months)
    return (
      <td
        key={day}
        style={{
          padding: '4px',
          textAlign: 'center',
          border: '1px solid #d1d5db',
          minWidth: '80px',
          height: '60px',
          backgroundColor: isWeekendDay ? '#f3f4f6' : '#f9fafb',
          color: isWeekendDay ? '#9ca3af' : '#6b7280',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '4px',
          fontSize: '10px',
          color: '#9ca3af',
          fontWeight: '500'
        }}>
          {dayNumber}
        </div>
        <div style={{ 
          fontWeight: '700',
          fontSize: '18px',
          color: '#1e40af',
          paddingTop: '12px'
        }}>
          {value || ''}
        </div>
      </td>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px 16px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <button 
            onClick={prevPeriod}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            ← Previous
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '4px'
            }}>
              <button
                onClick={() => setViewMode('monthly')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === 'monthly' ? '#2563eb' : 'transparent',
                  color: viewMode === 'monthly' ? '#ffffff' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === 'weekly' ? '#2563eb' : 'transparent',
                  color: viewMode === 'weekly' ? '#ffffff' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Weekly
              </button>
            </div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0'
            }}>
              {getDisplayTitle()}
            </h1>
          </div>
          
          <button 
            onClick={nextPeriod}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Next →
          </button>
        </div>

        {/* Calendar Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr>
                  {weeks[0] && 
                    Object.keys(weeks[0]).map(day => 
                      renderDayHeader(day)
                    )
                  }
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#dbeafe',
                    fontWeight: '600',
                    color: '#1e40af'
                  }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {Object.keys(week).map(day => 
                      renderCell(week, weekIndex, day)
                    )}
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#dbeafe',
                      fontWeight: '700',
                      color: '#1e40af'
                    }}>
                      {calculateWeekTotal(week).toFixed(1)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td 
                    colSpan={weeks[0] ? Object.keys(weeks[0]).length : 1} 
                    style={{
                      padding: '16px 12px',
                      textAlign: 'right',
                      paddingRight: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    {viewMode === 'weekly' ? 'Week' : 'Month'} Total:
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#dcfce7',
                    fontWeight: '700',
                    color: '#166534',
                    fontSize: '18px'
                  }}>
                    {monthTotal.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '24px',
          backgroundColor: '#eff6ff',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <h3 style={{
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '8px',
            marginTop: '0'
          }}>How to use:</h3>
          <ul style={{
            color: '#1e40af',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: '0',
            paddingLeft: '16px'
          }}>
            <li>• Switch between Weekly and Monthly views using the toggle</li>
            <li>• Type numbers directly in weekday cells</li>
            <li>• Use Tab to move between cells</li>
            <li>• Data is automatically saved as you type</li>
            <li>• Weekends are disabled (grayed out)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
