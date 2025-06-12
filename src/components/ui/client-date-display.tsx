'use client';

import React, { useState, useEffect } from 'react';

interface ClientDateDisplayProps {
  date: Date | string;
  format?: 'date' | 'time' | 'datetime';
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
}

/**
 * Client-only date display component to prevent hydration mismatches
 * 
 * This component ensures that date formatting only happens on the client side,
 * preventing server/client rendering differences that cause hydration errors.
 */
export function ClientDateDisplay({ 
  date, 
  format = 'date', 
  options,
  fallback = '--'
}: ClientDateDisplayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{fallback}</span>;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return <span>{fallback}</span>;
  }

  let formattedDate: string;

  if (options) {
    formattedDate = dateObj.toLocaleDateString('en-US', options);
  } else {
    switch (format) {
      case 'time':
        formattedDate = dateObj.toLocaleTimeString();
        break;
      case 'datetime':
        formattedDate = dateObj.toLocaleString();
        break;
      case 'date':
      default:
        formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        break;
    }
  }

  return <span>{formattedDate}</span>;
}

/**
 * Simplified client-only time display
 */
export function ClientTimeDisplay({ 
  date,
  fallback = '--:--:--'
}: { 
  date?: Date;
  fallback?: string;
}) {
  return (
    <ClientDateDisplay 
      date={date || new Date()} 
      format="time" 
      fallback={fallback}
    />
  );
}

/**
 * Simplified client-only date display with common format
 */
export function ClientSimpleDateDisplay({ 
  date,
  fallback = '--'
}: { 
  date: Date | string;
  fallback?: string;
}) {
  return (
    <ClientDateDisplay 
      date={date} 
      format="date"
      options={{
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }}
      fallback={fallback}
    />
  );
}
