
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface TimesheetCardProps {
  date: Date;
  timeIn: string | null;
  timeOut: string | null;
  hoursWorked: number;
  onTimeIn: () => void;
  onTimeOut: () => void;
}

const TimesheetCard = ({
  date,
  timeIn,
  timeOut,
  hoursWorked,
  onTimeIn,
  onTimeOut,
}: TimesheetCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {format(date, 'EEEE, MMMM d')}
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Time In:</span>
            <span className="font-medium">{timeIn || '--:--'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Time Out:</span>
            <span className="font-medium">{timeOut || '--:--'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Hours Worked:</span>
            <span className="font-medium">{hoursWorked.toFixed(2)}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={onTimeIn} 
              disabled={!!timeIn}
              className="flex-1"
            >
              Clock In
            </Button>
            <Button 
              onClick={onTimeOut} 
              disabled={!timeIn || !!timeOut}
              className="flex-1"
            >
              Clock Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimesheetCard;
