'use client';

import { useEffect, useState } from 'react';
import { Text } from '@once-ui-system/core';

interface TimeDisplayProps {
  timeZone: string;
  locale?: string;
  format?: '12' | '24';
  showSeconds?: boolean;
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeZone,
  locale = 'en-US',
  format = '24',
  showSeconds = true,
  className,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: format === '12',
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale, format, showSeconds]);

  return (
    <Text
      variant="body-default-s"
      className={className}
      suppressHydrationWarning
    >
      {currentTime}
    </Text>
  );
};
