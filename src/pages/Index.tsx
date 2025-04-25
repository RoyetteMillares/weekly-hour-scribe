
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
  const [currentEntry, setCurrentEntry] = useState<TimeEntry>({
    date: new Date(),
    timeIn: null,
    timeOut: null,
    hoursWorked: 0,
  });

  const [weeklyHours, setWeeklyHours] = useState(0);
  const targetHours = 40;

  const handleTimeIn = () => {
    const now = new Date();
    setCurrentEntry(prev => ({
      ...prev,
      timeIn: format(now, 'HH:mm'),
    }));
    toast({
      title: "Clocked In",
      description: `Time recorded: ${format(now, 'HH:mm')}`,
    });
  };

  const handleTimeOut = () => {
    const now = new Date();
    const timeOut = format(now, 'HH:mm');
    
    // Calculate hours worked
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

  // Check if it's Friday to show weekly summary
  useEffect(() => {
    const now = new Date();
    if (now.getDay() === 5) { // Friday is 5
      toast({
        title: "Weekly Summary",
        description: `Total hours this week: ${weeklyHours.toFixed(2)}`,
      });
    }
  }, [weeklyHours]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Timesheet Tracker</h1>
        <div className="max-w-4xl mx-auto space-y-6">
          <WeeklySummary totalHours={weeklyHours} targetHours={targetHours} />
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
