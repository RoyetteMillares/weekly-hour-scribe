
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklySummaryProps {
  totalHours: number;
  targetHours: number;
}

const WeeklySummary = ({ totalHours, targetHours }: WeeklySummaryProps) => {
  const progress = (totalHours / targetHours) * 100;
  const regularHours = Math.min(totalHours, targetHours);
  const overtimeHours = Math.max(0, totalHours - targetHours);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Regular Hours</span>
            <span className="font-medium">{regularHours.toFixed(2)}</span>
          </div>
          {overtimeHours > 0 && (
            <div className="flex justify-between items-center">
              <span>Overtime Hours</span>
              <span className="font-medium text-orange-600">{overtimeHours.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span>Total Hours</span>
            <span className="font-medium">{totalHours.toFixed(2)} / {targetHours}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {progress >= 100 
              ? `Great job! You've worked ${overtimeHours.toFixed(2)} hours overtime this week.` 
              : `${(targetHours - totalHours).toFixed(2)} hours remaining this week`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;
