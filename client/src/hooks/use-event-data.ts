import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabaseClient";
import { format } from "date-fns";
import { toast } from "sonner";
import Fuse from "fuse.js";

export type EventType = {
  id: number;
  event_name: string;
  event_date_time: string;
  event_description: string;
  applicant_email: string;
  interviewer_name: string;
  interview_result: string;
  applicant_details?: {
    id: string;
    applicant_name: string;
    applied_position: string;
  };
};

export function useEvents(date?: Date) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<EventType[]>([]);

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!formattedDate) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select(
            `
            id,
            event_name,
            event_date_time,
            event_description,
            applicant_email,
            interviewer_name,
            interview_result,
            applicant_details:applicant_email(id, applicant_name, applied_position)
          `
          )
          .filter("event_date_time", "gte", `${formattedDate}T00:00:00`)
          .filter("event_date_time", "lte", `${formattedDate}T23:59:59`)
          .order("event_date_time", { ascending: true });

        if (error) {
          throw error;
        }

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    if (formattedDate) {
      fetchEvents();
    }
  }, [formattedDate]);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error: eventError } = await supabase
        .from("events")
        .select(
          `
          id,
          event_name,
          event_date_time,
          event_description,
          applicant_email,
          interviewer_name,
          applicant_details:applicant_email(id, applicant_name, applied_position)
        `
        )
        .order("event_date_time", { ascending: true });

      if (eventError) {
        throw eventError;
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching all events:", error);
      toast.error("Failed to load events for search");
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
        "event_name",
        "event_description",
        "interviewer_name",
        "applicant_details.applicant_name",
        "applicant_details.applied_position",
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
    const eventDate = new Date(dateTimeString);
    return format(eventDate, "h:mm a");
  };

  const formatEventDate = (dateTimeString: string): string => {
    const eventDate = new Date(dateTimeString);
    return format(eventDate, "d MMM, yyyy");
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
