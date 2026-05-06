'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, parseISO, getDay, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { hoursDB } from '../../lib/indexedDB';
import {
  loadTrackerDisplayNames,
  saveTrackerDisplayNames,
  hasConfiguredDisplayNames,
  type TrackerDisplayNames,
} from '../../lib/trackerDisplayNames';

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

  const [displayNames, setDisplayNames] = useState<TrackerDisplayNames>({ myName: '', managerName: '' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftMyName, setDraftMyName] = useState('');
  const [draftManagerName, setDraftManagerName] = useState('');

  useEffect(() => {
    setDisplayNames(loadTrackerDisplayNames());
  }, []);

  const openSettings = useCallback(() => {
    const current = loadTrackerDisplayNames();
    setDraftMyName(current.myName);
    setDraftManagerName(current.managerName);
    setSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen, closeSettings]);

  const handleSaveDisplayNames = () => {
    const next: TrackerDisplayNames = {
      myName: draftMyName.trim(),
      managerName: draftManagerName.trim(),
    };
    saveTrackerDisplayNames(next);
    setDisplayNames(next);
    closeSettings();
  };

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

  useEffect(() => {
    let weeksData: WeekData[] = [];

    if (viewMode === 'weekly') {
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      const week: WeekData = {};
      weekDays.forEach((day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        week[dayKey] = monthData[dayKey] || '';
      });

      weeksData = [week];
    } else {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);

      const firstDay = new Date(startDate);
      const dayOfWeek = getDay(firstDay);
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      firstDay.setDate(firstDay.getDate() - daysToSubtract);

      const lastDay = new Date(endDate);
      const lastDayOfWeek = getDay(lastDay);
      const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      lastDay.setDate(lastDay.getDate() + daysToAdd);

      const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });

      for (let i = 0; i < allDays.length; i += 7) {
        const weekDays = allDays.slice(i, i + 7);
        const week: WeekData = {};

        weekDays.forEach((day) => {
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
        color: !isCurrentMonth ? '#9ca3af' : '#374151',
      }}>
        <div style={{ fontWeight: '600' }}>{format(date, 'EEE')}</div>
        <div style={{ fontSize: '12px' }}>{format(date, 'MM/dd')}</div>
      </th>
    );
  };

  const renderCell = (week: WeekData, _weekIndex: number, day: string) => {
    const date = parseISO(day);
    const isWeekendDay = isWeekend(date);
    const isCurrentPeriod = viewMode === 'weekly' ? true : isSameMonth(date, currentMonth);
    const isEditable = !isWeekendDay && isCurrentPeriod;
    const value = week[day] || '';
    const dayNumber = format(date, 'd');

    if (isEditable) {
      return (
        <td key={day} style={{
          padding: '4px',
          border: '1px solid #d1d5db',
          backgroundColor: '#ffffff',
          minWidth: '80px',
          height: '60px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '2px',
            left: '4px',
            fontSize: '10px',
            color: '#6b7280',
            fontWeight: '500',
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
              paddingTop: '12px',
            }}
            placeholder="0"
          />
        </td>
      );
    }

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
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '4px',
          fontSize: '10px',
          color: '#9ca3af',
          fontWeight: '500',
        }}>
          {dayNumber}
        </div>
        <div style={{
          fontWeight: '700',
          fontSize: '18px',
          color: '#1e40af',
          paddingTop: '12px',
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
      fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md ring-1 ring-indigo-100 transition hover:bg-indigo-50 hover:ring-indigo-200"
            >
              ← Back to home
            </Link>
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-violet-700 hover:ring-violet-200"
              aria-label="Names and display settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.114.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '24px',
        }}>
          <button
            type="button"
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
              transition: 'background-color 0.15s ease-in-out',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '4px',
            }}>
              <button
                type="button"
                onClick={() => setViewMode('monthly')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === 'monthly' ? '#2563eb' : 'transparent',
                  color: viewMode === 'monthly' ? '#ffffff' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setViewMode('weekly')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === 'weekly' ? '#2563eb' : 'transparent',
                  color: viewMode === 'weekly' ? '#ffffff' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Weekly
              </button>
            </div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0',
            }}>
              {getDisplayTitle()}
            </h1>
          </div>

          <button
            type="button"
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
              transition: 'background-color 0.15s ease-in-out',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
          >
            Next →
          </button>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          {hasConfiguredDisplayNames(displayNames) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
                padding: '16px 24px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  textAlign: 'left',
                }}
              >
                {displayNames.myName.trim() ? (
                  <>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        marginBottom: '6px',
                        lineHeight: 1.3,
                      }}
                    >
                      Employee
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: 1.35,
                      }}
                    >
                      {displayNames.myName.trim()}
                    </div>
                  </>
                ) : null}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  textAlign: 'right',
                }}
              >
                {displayNames.managerName.trim() ? (
                  <>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        marginBottom: '6px',
                        lineHeight: 1.3,
                      }}
                    >
                      Manager
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: 1.35,
                      }}
                    >
                      {displayNames.managerName.trim()}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr>
                  {weeks[0]
                    && Object.keys(weeks[0]).map((day) => renderDayHeader(day))}
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#dbeafe',
                    fontWeight: '600',
                    color: '#1e40af',
                  }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {Object.keys(week).map((day) => renderCell(week, weekIndex, day))}
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#dbeafe',
                      fontWeight: '700',
                      color: '#1e40af',
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
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    {viewMode === 'weekly' ? 'Week' : 'Month'}
                    {' '}
                    Total:
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#dcfce7',
                    fontWeight: '700',
                    color: '#166534',
                    fontSize: '18px',
                  }}>
                    {monthTotal.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          backgroundColor: '#eff6ff',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <h3 style={{
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '8px',
            marginTop: '0',
          }}>
            How to use:
          </h3>
          <ul style={{
            color: '#1e40af',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: '0',
            paddingLeft: '16px',
          }}>
            <li>• Switch between Weekly and Monthly views using the toggle</li>
            <li>• Type numbers directly in weekday cells</li>
            <li>• Use Tab to move between cells</li>
            <li>• Data is automatically saved as you type</li>
            <li>• Weekends are disabled (grayed out)</li>
          </ul>
        </div>
      </div>

      {settingsOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[100] cursor-default bg-black/40"
            aria-label="Close settings"
            onClick={closeSettings}
          />
          <div
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tracker-settings-title"
          >
            <h2 id="tracker-settings-title" className="text-lg font-bold text-slate-900">
              Display names
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Shown above the calendar when at least one is filled in. Saved only on this device.
            </p>
            <label className="mt-4 block text-sm font-semibold text-slate-700" htmlFor="tracker-my-name">
              Employee name
            </label>
            <input
              id="tracker-my-name"
              type="text"
              value={draftMyName}
              onChange={(e) => setDraftMyName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="e.g. Alex Kim"
              autoComplete="name"
            />
            <label className="mt-4 block text-sm font-semibold text-slate-700" htmlFor="tracker-manager-name">
              Manager&apos;s name
            </label>
            <input
              id="tracker-manager-name"
              type="text"
              value={draftManagerName}
              onChange={(e) => setDraftManagerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="e.g. Jordan Lee"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeSettings}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDisplayNames}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-violet-700"
              >
                Save
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
