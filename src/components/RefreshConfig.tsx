import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export type RefreshInterval = 60000 | 300000 | 1800000 | 3600000; // 1min, 5min, 30min, 1h in milliseconds

interface RefreshConfigProps {
  onIntervalChange: (interval: RefreshInterval) => void;
}

export const RefreshConfig = ({ onIntervalChange }: RefreshConfigProps) => {
  const [selectedInterval, setSelectedInterval] = useState<RefreshInterval>(300000);

  const handleIntervalChange = (value: string) => {
    const interval = parseInt(value) as RefreshInterval;
    setSelectedInterval(interval);
    onIntervalChange(interval);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-2">
      <Select
        value={selectedInterval.toString()}
        onValueChange={handleIntervalChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Refresh interval" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="60000">1 minute</SelectItem>
          <SelectItem value="300000">5 minutes</SelectItem>
          <SelectItem value="1800000">30 minutes</SelectItem>
          <SelectItem value="3600000">1 hour</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};