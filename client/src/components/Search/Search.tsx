import { Search as SearchIcon, X, User, Calendar } from "lucide-react";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { useEvents, EventType } from "@/hooks/use-event-data";
import useTableData from "@/hooks/use-table-data";
import { Link } from "react-router-dom";

type Applicant = {
  id: string;
  applicant_name: string;
  applied_position: string;
  experience?: string;
  email: string;
  technology?: string;
};

const Search = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [applicantSearchResults, setApplicantSearchResults] = useState<
    Applicant[]
  >([]);
  const [eventSearchResults, setEventSearchResults] = useState<EventType[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const applicantData = useTableData();

  const { fetchAllEvents, formatEventDate } = useEvents();

  const applicantFuse = new Fuse(applicantData || [], {
    includeScore: true,
    threshold: 0.4,
    keys: ["applicant_name", "applied_position", "email"],
  });

  const eventFuse = new Fuse(allEvents, {
    includeScore: true,
    threshold: 0.4,
    keys: [
      "event_name",
      "interviewer_name",
      "event_date_time",
      "applicant_details.applicant_name",
    ],
  });

  useEffect(() => {
    const loadEvents = async () => {
      const events = await fetchAllEvents();
      setAllEvents(events);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const applicantResults = applicantFuse
        .search(searchText)
        .map((result) => result.item);

      const eventResults = eventFuse
        .search(searchText)
        .map((result) => result.item);

      setApplicantSearchResults(applicantResults);
      setEventSearchResults(eventResults);
      setShowResults(true);
    } else {
      setApplicantSearchResults([]);
      setEventSearchResults([]);
      setShowResults(false);
    }
  }, [searchText, applicantData, allEvents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        const inputElement = document.querySelector("input");
        if (inputElement) inputElement.focus();
      }, 300);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setShowResults(false);
  };

  const handleApplicantClick = (applicant: Applicant) => {
    console.log("Selected applicant:", applicant);
    setShowResults(false);
  };

  const handleEventClick = (event: EventType) => {
    console.log("Selected event:", event);
    setShowResults(false);
  };

  const hasResults =
    applicantSearchResults.length > 0 || eventSearchResults.length > 0;

  return (
    <div className="ml-4 flex items-center relative" ref={searchRef}>
      {isMobile ? (
        <div className="flex items-center">
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center"
              >
                <Input
                  type="text"
                  className="indent-8 w-full min-w-0 text-foreground"
                  placeholder="Search candidates or events"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
                <motion.span
                  className="absolute left-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <SearchIcon size={18} />
                </motion.span>
                {searchText && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-3"
                    onClick={clearSearch}
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpand}
                className="p-2 rounded-full bg-primary/10 text-primary"
              >
                <SearchIcon size={18} />
              </motion.button>
            )}
          </AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="ml-2"
              onClick={toggleExpand}
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
      ) : (
        <motion.div
          className="relative flex items-center"
          initial={{ width: 400 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="absolute left-3"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
          >
            <SearchIcon size={18} />
          </motion.span>
          <Input
            type="text"
            className="indent-8 text-foreground focus:border-primary transition-all duration-300"
            placeholder="Search candidates or events"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => {
              if (searchText && hasResults) {
                setShowResults(true);
              }
            }}
          />
          <AnimatePresence>
            {searchText && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3"
                onClick={clearSearch}
              >
                <X size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showResults && hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border rounded-md shadow-lg max-h-80 overflow-y-auto"
            style={{ width: isMobile ? "calc(100vw - 2rem)" : "400px" }}
          >
            {applicantSearchResults.length > 0 && (
              <div className="p-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1 flex items-center gap-1">
                  <User size={14} />
                  <span>Candidates</span>
                </div>
                {applicantSearchResults.map((applicant) => (
                  <Link
                    to={`/dashboard/application-review/${applicant.id}`}
                    key={applicant.id}
                  >
                    <motion.div
                      whileHover={{
                        backgroundColor: "rgba(var(--primary), 0.1)",
                      }}
                      className="p-3 rounded-md cursor-pointer"
                      onClick={() => handleApplicantClick(applicant)}
                    >
                      <div className="font-medium">
                        {applicant.applicant_name}
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>
                          {applicant.applied_position}{" "}
                          {applicant.technology
                            ? `• ${applicant.technology}`
                            : ""}
                        </span>
                        <span>{applicant.experience || ""}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {applicantSearchResults.length > 0 &&
              eventSearchResults.length > 0 && (
                <div className="border-t mx-2"></div>
              )}

            {eventSearchResults.length > 0 && (
              <div className="p-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1 flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Events</span>
                </div>
                {eventSearchResults.map((event) => (
                  <Link
                    to={`/application-review/${event?.applicant_details?.id}`}
                    key={`${event.id}`}
                  >
                    <motion.div
                      whileHover={{
                        backgroundColor: "rgba(var(--primary), 0.1)",
                      }}
                      className="p-3 rounded-md cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-medium">{event.event_name}</div>
                      <div className="text-sm flex justify-between">
                        <span className="text-primary">
                          {formatEventDate(event.event_date_time)}
                        </span>
                        <span className="text-muted-foreground">
                          With {event.interviewer_name}
                        </span>
                      </div>
                      {event.applicant_details && (
                        <div className="text-xs text-muted-foreground mt-1">
                          For: {event.applicant_details.applicant_name} (
                          {event.applicant_details.applied_position})
                        </div>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {!hasResults && searchText && (
              <div className="p-4 text-center text-muted-foreground">
                No results found for "{searchText}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
