
import React, { useState, useEffect } from 'react';
import TimesheetCard from '../components/Timesheet/TimesheetCard';
import WeeklySummary from '../components/Timesheet/WeeklySummary';
import { format } from 'date-fns';
import { toast } from "@/components/ui/use-toast";

interface TimeEntry {
  date: Date;
  timeIn: string | null;
  timeOut: string | null;
  hoursWorked: number;
}

const Index = () => {
  const [currentEntry, setCurrentEntry] = useState<TimeEntry>(() => {
    const saved = localStorage.getItem('currentEntry');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        date: new Date(parsed.date) // Convert date string back to Date object
      };
    }
    return {
      date: new Date(),
      timeIn: null,
      timeOut: null,
      hoursWorked: 0,
    };
  });

  const [weeklyHours, setWeeklyHours] = useState(() => {
    const saved = localStorage.getItem('weeklyHours');
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('currentEntry', JSON.stringify(currentEntry));
  }, [currentEntry]);

  useEffect(() => {
    localStorage.setItem('weeklyHours', weeklyHours.toString());
  }, [weeklyHours]);

  useEffect(() => {
    const today = new Date();
    const entryDate = new Date(currentEntry.date);
    
    if (today.getDate() !== entryDate.getDate() || 
        today.getMonth() !== entryDate.getMonth() || 
        today.getFullYear() !== entryDate.getFullYear()) {
      setCurrentEntry({
        date: today,
        timeIn: null,
        timeOut: null,
        hoursWorked: 0,
      });
    }
  }, [currentEntry.date]);

  const handleTimeIn = () => {
    const now = new Date();
    setCurrentEntry(prev => ({
      ...prev,
      timeIn: format(now, 'HH:mm'), // Store in 24-hour format
    }));
    toast({
      title: "Clocked In",
      description: `Time recorded: ${format(now, 'h:mm a')}`, // Display in 12-hour format
    });
  };

  const handleTimeOut = () => {
    const now = new Date();
    const timeOut = format(now, 'HH:mm'); // Store in 24-hour format
    
    const timeInParts = currentEntry.timeIn!.split(':');
    const timeOutParts = timeOut.split(':');
    const timeInMinutes = parseInt(timeInParts[0]) * 60 + parseInt(timeInParts[1]);
    const timeOutMinutes = parseInt(timeOutParts[0]) * 60 + parseInt(timeOutParts[1]);
    const hoursWorked = (timeOutMinutes - timeInMinutes) / 60;

    setCurrentEntry(prev => ({
      ...prev,
      timeOut,
      hoursWorked,
    }));

    setWeeklyHours(prev => prev + hoursWorked);

    toast({
      title: "Clocked Out",
      description: `Hours worked today: ${hoursWorked.toFixed(2)}`,
    });
  };

  useEffect(() => {
    const now = new Date();
    if (now.getDay() === 5) { // Friday is 5
      toast({
        title: "Weekly Summary",
        description: `Total hours this week: ${weeklyHours.toFixed(2)}`,
      });
    }
  }, [weeklyHours]);

  useEffect(() => {
    const now = new Date();
    if (now.getDay() === 1) { // Monday is 1
      const lastReset = localStorage.getItem('lastWeeklyReset');
      const today = now.toDateString();
      
      if (lastReset !== today) {
        setWeeklyHours(0);
        localStorage.setItem('lastWeeklyReset', today);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Timesheet Tracker</h1>
        <div className="max-w-4xl mx-auto space-y-6">
          <WeeklySummary totalHours={weeklyHours} targetHours={40} />
          <TimesheetCard
            date={currentEntry.date}
            timeIn={currentEntry.timeIn}
            timeOut={currentEntry.timeOut}
            hoursWorked={currentEntry.hoursWorked}
            onTimeIn={handleTimeIn}
            onTimeOut={handleTimeOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
