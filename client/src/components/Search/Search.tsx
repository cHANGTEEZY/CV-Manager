import { Search as SearchIcon, X, User, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { useEvents, EventType } from '@/hooks/use-event-data';
import useTableData from '@/hooks/use-table-data';
import { Link } from 'react-router-dom';

// Updated Applicant type to match your backend data structure
type Applicant = {
  id: number;
  applicant_name: string;
  applied_position: string;
  applicant_email: string; // renamed from email to match backend
  tech_stack?: string; // renamed from technology to match backend
  applicant_experience?: string; // renamed from experience to match backend
  applicant_experience_level?: string;
  // Include other fields that might be needed
  applicant_status?: string;
  applicant_verdict?: string;
};

const Search = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [applicantSearchResults, setApplicantSearchResults] = useState<
    Applicant[]
  >([]);
  const [eventSearchResults, setEventSearchResults] = useState<EventType[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const { tableData } = useTableData();

  const { fetchAllEvents, formatEventDate } = useEvents();

  // Updated keys to match the new Applicant type
  const applicantFuse = new Fuse(tableData || [], {
    includeScore: true,
    threshold: 0.4,
    keys: [
      'applicant_name',
      'applied_position',
      'applicant_email',
      'tech_stack',
    ],
  });

  const eventFuse = new Fuse(allEvents, {
    includeScore: true,
    threshold: 0.4,
    keys: [
      'event_name',
      'interviewer_name',
      'event_date_time',
      'applicant_details.applicant_name',
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
  }, [searchText, tableData, allEvents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        const inputElement = document.querySelector('input');
        if (inputElement) inputElement.focus();
      }, 300);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setShowResults(false);
  };

  const handleApplicantClick = (applicant: Applicant) => {
    console.log('Selected applicant:', applicant);
    setShowResults(false);
  };

  const handleEventClick = (event: EventType) => {
    console.log('Selected event:', event);
    setShowResults(false);
  };

  const hasResults =
    applicantSearchResults.length > 0 || eventSearchResults.length > 0;

  return (
    <div className="relative ml-4 flex items-center" ref={searchRef}>
      {isMobile ? (
        <div className="flex items-center">
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex items-center"
              >
                <Input
                  type="text"
                  className="text-foreground w-full min-w-0 indent-8"
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
                className="bg-primary/10 text-primary rounded-full p-2"
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
            className="text-foreground focus:border-primary indent-8 transition-all duration-300"
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
            className="bg-card absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border shadow-lg"
            style={{ width: isMobile ? 'calc(100vw - 2rem)' : '400px' }}
          >
            {applicantSearchResults.length > 0 && (
              <div className="p-2">
                <div className="text-muted-foreground flex items-center gap-1 px-2 py-1 text-xs tracking-wider uppercase">
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
                        backgroundColor: 'rgba(var(--primary), 0.1)',
                      }}
                      className="cursor-pointer rounded-md p-3"
                      onClick={() => handleApplicantClick(applicant)}
                    >
                      <div className="font-medium">
                        {applicant.applicant_name}
                      </div>
                      <div className="text-muted-foreground flex justify-between text-sm">
                        <span>
                          {applicant.applied_position}{' '}
                          {applicant.tech_stack
                            ? `• ${applicant.tech_stack}`
                            : ''}
                        </span>
                        <span>{applicant.applicant_experience || ''}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {applicantSearchResults.length > 0 &&
              eventSearchResults.length > 0 && (
                <div className="mx-2 border-t"></div>
              )}

            {eventSearchResults.length > 0 && (
              <div className="p-2">
                <div className="text-muted-foreground flex items-center gap-1 px-2 py-1 text-xs tracking-wider uppercase">
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
                        backgroundColor: 'rgba(var(--primary), 0.1)',
                      }}
                      className="cursor-pointer rounded-md p-3"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-medium">{event.event_name}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-primary">
                          {formatEventDate(event.event_date_time)}
                        </span>
                        <span className="text-muted-foreground">
                          With {event.interviewer_name}
                        </span>
                      </div>
                      {event.applicant_details && (
                        <div className="text-muted-foreground mt-1 text-xs">
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
              <div className="text-muted-foreground p-4 text-center">
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
