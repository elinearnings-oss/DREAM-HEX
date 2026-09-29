import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isPast: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
        if (onComplete) onComplete();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (timeLeft.isPast) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 font-mono tabular-nums">
        <Clock className="w-3.5 h-3.5" />
        <span>Cycle Ready to Settle</span>
      </span>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-mono tabular-nums text-slate-300">
        <Clock className="w-3 h-3 text-rose-500 shrink-0" />
        <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-200">
      <Clock className="w-4 h-4 text-rose-500 shrink-0" />
      <span className="text-sm font-semibold tracking-wider">
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
};
