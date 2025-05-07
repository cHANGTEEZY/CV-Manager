import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { supabase } from '@/utils/supabaseClient';

export type EventType = {
  id: number;
  event_name: string;
  event_date_time: string;
  event_description: string;
  applicant_email: string;
  interviewer_name: string;
  interview_result: string;
  interview_type?: string;
  applicant_details?: {
    id: string;
    applicant_name: string;
    applied_position: string;
  };
};

export function useEvents(date?: Date) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<EventType[]>([]);

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;

  const fetchEvents = async () => {
    if (!formattedDate) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(
          `
            *,
            applicant_details:applicant_email(id, applicant_name, applied_position)
          `
        )
        .gte('event_date_time', `${formattedDate}T00:00:00`)
        .lte('event_date_time', `${formattedDate}T23:59:59`)
        .order('event_date_time', { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!formattedDate) return;

    fetchEvents();

    const subscription = supabase
      .channel(`events-${formattedDate}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `event_date_time=gte.${formattedDate}T00:00:00`,
        },
        async (payload) => {
          try {
            if (
              payload.eventType === 'INSERT' ||
              payload.eventType === 'UPDATE'
            ) {
              const { data: applicantData, error: applicantError } =
                await supabase
                  .from('applicant_details')
                  .select('id, applicant_name, applied_position')
                  .eq('applicant_email', payload.new.applicant_email)
                  .single();

              const eventWithDetails: EventType = {
                id: payload.new.id,
                event_name: payload.new.event_name,
                event_date_time: payload.new.event_date_time,
                event_description: payload.new.event_description,
                applicant_email: payload.new.applicant_email,
                interviewer_name: payload.new.interviewer_name,
                interview_result: payload.new.interview_result,
                interview_type: payload.new.interview_type,
                applicant_details: applicantError ? undefined : applicantData,
              };

              if (payload.eventType === 'INSERT') {
                setEvents((prevEvents) => {
                  if (
                    prevEvents.some((event) => event.id === eventWithDetails.id)
                  ) {
                    return prevEvents;
                  }
                  return [...prevEvents, eventWithDetails].sort(
                    (a, b) =>
                      new Date(a.event_date_time).getTime() -
                      new Date(b.event_date_time).getTime()
                  );
                });
              } else if (payload.eventType === 'UPDATE') {
                setEvents((prevEvents) =>
                  prevEvents.map((event) =>
                    event.id === eventWithDetails.id ? eventWithDetails : event
                  )
                );
              }
            } else if (payload.eventType === 'DELETE') {
              setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== payload.old.id)
              );
            }
          } catch (error) {
            console.error('Error processing real-time update:', error);
            toast.error('Failed to process event update');
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscription active for events');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error or closed:', status);
        }
      });

    // Cleanup subscription on unmount or date change
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [formattedDate]);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(
          `
            *,
            applicant_details:applicant_email(id, applicant_name, applied_position)
          `
        )
        .order('event_date_time', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all events:', error);
      toast.error('Failed to load events for search');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const eventFuse = useMemo(() => {
    return new Fuse(events, {
      includeScore: true,
      threshold: 0.4,
      keys: [
        'event_name',
        'event_description',
        'interviewer_name',
        'applicant_details.applicant_name',
        'applicant_details.applied_position',
      ],
    });
  }, [events]);

  const searchEvents = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    const results = eventFuse.search(query).map((result) => result.item);
    setSearchResults(results);
    return results;
  };

  const formatEventTime = (dateTimeString: string): string => {
    try {
      const eventDate = new Date(dateTimeString);
      if (isNaN(eventDate.getTime())) {
        return 'Invalid Time';
      }
      return format(eventDate, 'h:mm a');
    } catch {
      return 'Invalid Time';
    }
  };

  const formatEventDate = (dateTimeString: string): string => {
    try {
      const eventDate = new Date(dateTimeString);
      if (isNaN(eventDate.getTime())) {
        return 'Invalid Date';
      }
      return format(eventDate, 'd MMM, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  return {
    events,
    isLoading,
    searchText,
    setSearchText,
    searchResults,
    searchEvents,
    fetchAllEvents,
    formatEventTime,
    formatEventDate,
  };
}
